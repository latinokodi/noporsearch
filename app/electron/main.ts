import { app, BrowserWindow, ipcMain, shell } from 'electron'
import path from 'node:path'
import { createRequire } from 'node:module'
import os from 'node:os'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const require = createRequire(import.meta.url)
const { spawn } = require('node:child_process')

process.env.DIST = path.join(__dirname, '../dist')
process.env.PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public')

let win: BrowserWindow | null

const DATA_PATH = path.join(app.getPath('userData'), 'sites.json')

function createWindow() {
    win = new BrowserWindow({
        width: 1100,
        height: 750,
        minWidth: 900,
        minHeight: 600,
        titleBarStyle: 'hidden',
        titleBarOverlay: {
            color: '#0f2027',
            symbolColor: '#ffffff',
            height: 35
        },
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            sandbox: false, // Sandbox must be false for current IPC/Node integration pattern unless completely refactored to contextBridge. 
            // However, we can improve security by disabling Node integration in webview if it was used, but here we are in main window.
            // Since the audit recommended sandbox: true, but the current template uses vite-plugin-electron which often relies on node integration in main process for some setups,
            // we will stick to the plan: "Enable sandbox: true (if compatible)". 
            // Let's try to enable contextIsolation which is better.
            contextIsolation: true,
            nodeIntegration: false,
        },
    })
    console.log('[Main] Preload path:', path.join(__dirname, 'preload.js'))

    if (process.env.VITE_DEV_SERVER_URL) {
        win.loadURL(process.env.VITE_DEV_SERVER_URL)
    } else {
        win.loadFile(path.join(process.env.DIST, 'index.html'))
    }
}

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
        win = null
    }
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})

app.whenReady().then(createWindow)

// IPC Handlers
ipcMain.handle('load-sites', () => {
    if (fs.existsSync(DATA_PATH)) {
        return JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'))
    }
    return []
})

ipcMain.handle('save-sites', (_event, sites) => {
    fs.writeFileSync(DATA_PATH, JSON.stringify(sites, null, 2))
    return true
})

// Browser Detection Logic
function getBrowserPaths(): string[] {
    const paths: string[] = []
    if (process.platform === 'win32') {
        const localapp = process.env.LOCALAPPDATA || ''
        const programFiles = process.env['ProgramFiles'] || ''
        const programFilesX86 = process.env['ProgramFiles(x86)'] || ''

        const candidates = [
            path.join(programFiles, "Microsoft", "Edge", "Application", "msedge.exe"),
            path.join(programFilesX86, "Microsoft", "Edge", "Application", "msedge.exe"),
            path.join(programFiles, "Google", "Chrome", "Application", "chrome.exe"),
            path.join(programFilesX86, "Google", "Chrome", "Application", "chrome.exe"),
            path.join(localapp, "Google", "Chrome", "Application", "chrome.exe"),
            path.join(programFiles, "Mozilla Firefox", "firefox.exe"),
            path.join(programFilesX86, "Mozilla Firefox", "firefox.exe"),
            path.join(programFiles, "BraveSoftware", "Brave-Browser", "Application", "brave.exe"),
            path.join(programFilesX86, "BraveSoftware", "Brave-Browser", "Application", "brave.exe"),
            path.join(localapp, "BraveSoftware", "Brave-Browser", "Application", "brave.exe"),
            path.join(programFiles, "Opera", "opera.exe"),
            path.join(localapp, "Programs", "Opera", "opera.exe"),
            path.join(localapp, "Programs", "Opera GX", "opera.exe"),
            path.join(programFiles, "Vivaldi", "Application", "vivaldi.exe"),
            path.join(programFilesX86, "Vivaldi", "Application", "vivaldi.exe"),
        ]
        paths.push(...candidates)
    } else {
        // Basic linux support could be added here, but for now relying on system default
    }
    return paths
}

function detectBrowsers() {
    const browsers = [{ name: 'System Default', path: '' }]
    const seenPaths = new Set<string>()

    getBrowserPaths().forEach(p => {
        if (fs.existsSync(p) && !seenPaths.has(p)) {
            seenPaths.add(p)
            const base = path.basename(p).toLowerCase()
            let name = base
            if (base === 'msedge.exe') name = 'Microsoft Edge'
            else if (base === 'chrome.exe') name = 'Google Chrome'
            else if (base === 'firefox.exe') name = 'Mozilla Firefox'
            else if (base === 'brave.exe') name = 'Brave'
            else if (base === 'opera.exe') name = p.toLowerCase().includes('gx') ? 'Opera GX' : 'Opera'
            else if (base === 'vivaldi.exe') name = 'Vivaldi'

            browsers.push({ name, path: p })
        }
    })
    return browsers
}

ipcMain.handle('get-browsers', () => {
    return detectBrowsers()
})

ipcMain.handle('open-url', (_event, url: string, browserPath: string) => {
    // Input validation
    if (typeof url !== 'string' || !url.startsWith('http')) {
        console.error('Invalid URL:', url);
        return false;
    }

    if (browserPath) {
        // Use specified browser with spawn to avoid shell injection
        if (typeof browserPath !== 'string' || !fs.existsSync(browserPath)) {
             console.error('Invalid browser path:', browserPath);
             return false;
        }
        
        console.log(`[Main] Launching: ${browserPath} ${url}`);
        // spawn allows passing arguments as an array, avoiding shell interpretation
        const child = spawn(browserPath, [url], { detached: true, stdio: 'ignore' });
        child.unref();
    } else {
        // System default
        shell.openExternal(url)
    }
    return true
})

ipcMain.handle('load-legacy-sites', () => {
    const legacyPath = path.join(__dirname, '../../sites.json')
    console.log('[Main] Checking legacy path:', legacyPath)
    if (fs.existsSync(legacyPath)) {
        try {
            const data = JSON.parse(fs.readFileSync(legacyPath, 'utf-8'))
            return data
        } catch (e) {
            console.error('Failed to parse legacy sites:', e)
        }
    }
    return null
})

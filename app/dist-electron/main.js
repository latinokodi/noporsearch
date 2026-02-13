"use strict";
const electron = require("electron");
const path = require("node:path");
const node_module = require("node:module");
const fs = require("node:fs");
const node_url = require("node:url");
var _documentCurrentScript = typeof document !== "undefined" ? document.currentScript : null;
const __dirname$1 = path.dirname(node_url.fileURLToPath(typeof document === "undefined" ? require("url").pathToFileURL(__filename).href : _documentCurrentScript && _documentCurrentScript.tagName.toUpperCase() === "SCRIPT" && _documentCurrentScript.src || new URL("main.js", document.baseURI).href));
const require$1 = node_module.createRequire(typeof document === "undefined" ? require("url").pathToFileURL(__filename).href : _documentCurrentScript && _documentCurrentScript.tagName.toUpperCase() === "SCRIPT" && _documentCurrentScript.src || new URL("main.js", document.baseURI).href);
const { spawn } = require$1("node:child_process");
process.env.DIST = path.join(__dirname$1, "../dist");
process.env.PUBLIC = electron.app.isPackaged ? process.env.DIST : path.join(process.env.DIST, "../public");
let win;
const DATA_PATH = path.join(electron.app.getPath("userData"), "sites.json");
function createWindow() {
  win = new electron.BrowserWindow({
    width: 1100,
    height: 750,
    minWidth: 900,
    minHeight: 600,
    titleBarStyle: "hidden",
    titleBarOverlay: {
      color: "#0f2027",
      symbolColor: "#ffffff",
      height: 35
    },
    webPreferences: {
      preload: path.join(__dirname$1, "preload.js"),
      sandbox: false,
      // Sandbox must be false for current IPC/Node integration pattern unless completely refactored to contextBridge. 
      // However, we can improve security by disabling Node integration in webview if it was used, but here we are in main window.
      // Since the audit recommended sandbox: true, but the current template uses vite-plugin-electron which often relies on node integration in main process for some setups,
      // we will stick to the plan: "Enable sandbox: true (if compatible)". 
      // Let's try to enable contextIsolation which is better.
      contextIsolation: true,
      nodeIntegration: false
    }
  });
  console.log("[Main] Preload path:", path.join(__dirname$1, "preload.js"));
  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(process.env.DIST, "index.html"));
  }
}
electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    electron.app.quit();
    win = null;
  }
});
electron.app.on("activate", () => {
  if (electron.BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
electron.app.whenReady().then(createWindow);
electron.ipcMain.handle("load-sites", () => {
  if (fs.existsSync(DATA_PATH)) {
    return JSON.parse(fs.readFileSync(DATA_PATH, "utf-8"));
  }
  return [];
});
electron.ipcMain.handle("save-sites", (_event, sites) => {
  fs.writeFileSync(DATA_PATH, JSON.stringify(sites, null, 2));
  return true;
});
function getBrowserPaths() {
  const paths = [];
  if (process.platform === "win32") {
    const localapp = process.env.LOCALAPPDATA || "";
    const programFiles = process.env["ProgramFiles"] || "";
    const programFilesX86 = process.env["ProgramFiles(x86)"] || "";
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
      path.join(programFilesX86, "Vivaldi", "Application", "vivaldi.exe")
    ];
    paths.push(...candidates);
  }
  return paths;
}
function detectBrowsers() {
  const browsers = [{ name: "System Default", path: "" }];
  const seenPaths = /* @__PURE__ */ new Set();
  getBrowserPaths().forEach((p) => {
    if (fs.existsSync(p) && !seenPaths.has(p)) {
      seenPaths.add(p);
      const base = path.basename(p).toLowerCase();
      let name = base;
      if (base === "msedge.exe") name = "Microsoft Edge";
      else if (base === "chrome.exe") name = "Google Chrome";
      else if (base === "firefox.exe") name = "Mozilla Firefox";
      else if (base === "brave.exe") name = "Brave";
      else if (base === "opera.exe") name = p.toLowerCase().includes("gx") ? "Opera GX" : "Opera";
      else if (base === "vivaldi.exe") name = "Vivaldi";
      browsers.push({ name, path: p });
    }
  });
  return browsers;
}
electron.ipcMain.handle("get-browsers", () => {
  return detectBrowsers();
});
electron.ipcMain.handle("open-url", (_event, url, browserPath) => {
  if (typeof url !== "string" || !url.startsWith("http")) {
    console.error("Invalid URL:", url);
    return false;
  }
  if (browserPath) {
    if (typeof browserPath !== "string" || !fs.existsSync(browserPath)) {
      console.error("Invalid browser path:", browserPath);
      return false;
    }
    console.log(`[Main] Launching: ${browserPath} ${url}`);
    const child = spawn(browserPath, [url], { detached: true, stdio: "ignore" });
    child.unref();
  } else {
    electron.shell.openExternal(url);
  }
  return true;
});
electron.ipcMain.handle("load-legacy-sites", () => {
  const legacyPath = path.join(__dirname$1, "../../sites.json");
  console.log("[Main] Checking legacy path:", legacyPath);
  if (fs.existsSync(legacyPath)) {
    try {
      const data = JSON.parse(fs.readFileSync(legacyPath, "utf-8"));
      return data;
    } catch (e) {
      console.error("Failed to parse legacy sites:", e);
    }
  }
  return null;
});

import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
    loadSites: () => ipcRenderer.invoke('load-sites'),
    saveSites: (sites: any) => ipcRenderer.invoke('save-sites', sites),
    openUrl: (url: string, browserPath?: string) => ipcRenderer.invoke('open-url', url, browserPath),
    loadLegacySites: () => ipcRenderer.invoke('load-legacy-sites'),
    getBrowsers: () => ipcRenderer.invoke('get-browsers'),
})

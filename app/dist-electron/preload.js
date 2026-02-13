"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("electronAPI", {
  loadSites: () => electron.ipcRenderer.invoke("load-sites"),
  saveSites: (sites) => electron.ipcRenderer.invoke("save-sites", sites),
  openUrl: (url, browserPath) => electron.ipcRenderer.invoke("open-url", url, browserPath),
  loadLegacySites: () => electron.ipcRenderer.invoke("load-legacy-sites"),
  getBrowsers: () => electron.ipcRenderer.invoke("get-browsers")
});

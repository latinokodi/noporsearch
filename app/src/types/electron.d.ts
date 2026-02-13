import { Site } from '../store/useAppStore'

export interface ElectronAPI {
    loadSites: () => Promise<Site[]>
    saveSites: (sites: Site[]) => Promise<boolean>
    getBrowsers: () => Promise<{ name: string; path: string }[]>
    openUrl: (url: string, browserPath: string) => Promise<boolean>
    loadLegacySites?: () => Promise<any>
}

declare global {
    interface Window {
        electronAPI: ElectronAPI
    }
}

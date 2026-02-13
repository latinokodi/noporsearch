import { create } from 'zustand'

export interface Site {
    id: string
    name: string
    urlTemplate: string
    joiner: string
    enabled: boolean
    group?: string
}

interface AppState {
    sites: Site[]
    searchQuery: string
    activeTab: 'search' | 'manage' | 'settings'
    browsers: { name: string; path: string }[]
    selectedBrowserPath: string
    setSites: (sites: Site[]) => void
    setSearchQuery: (query: string) => void
    setActiveTab: (tab: 'search' | 'manage' | 'settings') => void
    setBrowsers: (browsers: { name: string; path: string }[]) => void
    setSelectedBrowserPath: (path: string) => void
    addSite: (site: Site) => void
    updateSite: (id: string, site: Partial<Site>) => void
    deleteSite: (id: string) => void
    reorderSites: (startIndex: number, endIndex: number) => void
}

export const useAppStore = create<AppState>((set) => ({
    sites: [],
    searchQuery: '',
    activeTab: 'search',
    browsers: [],
    selectedBrowserPath: '',
    setSites: (sites) => set({ sites }),
    setSearchQuery: (searchQuery) => set({ searchQuery }),
    setActiveTab: (activeTab) => set({ activeTab }),
    setBrowsers: (browsers) => set({ browsers }),
    setSelectedBrowserPath: (selectedBrowserPath) => set({ selectedBrowserPath }),
    addSite: (site) => set((state) => ({ sites: [...state.sites, site] })),
    updateSite: (id, updatedFields) => set((state) => ({
        sites: state.sites.map(s => s.id === id ? { ...s, ...updatedFields } : s)
    })),
    deleteSite: (id) => set((state) => ({
        sites: state.sites.filter(s => s.id !== id)
    })),
    reorderSites: (startIndex, endIndex) => set((state) => {
        const result = Array.from(state.sites)
        const [removed] = result.splice(startIndex, 1)
        result.splice(endIndex, 0, removed)
        return { sites: result }
    }),
}))

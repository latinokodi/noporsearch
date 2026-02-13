import React, { useEffect, useState } from 'react'
import { Search, Plus, Save, X, Settings, Globe, ChevronDown, Check } from 'lucide-react'
import { useAppStore, type Site } from './store/useAppStore'
import { AddSiteModal } from './components/AddSiteModal'
import { SiteCard } from './components/SiteCard'

const App: React.FC = () => {
  const {
    sites, setSites, searchQuery, setSearchQuery,
    activeTab, setActiveTab, addSite, deleteSite, updateSite,
    browsers, setBrowsers, selectedBrowserPath, setSelectedBrowserPath
  } = useAppStore()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      try {
        if (!window.electronAPI) throw new Error('Electron API not found.')
        const loadedSites = await window.electronAPI.loadSites()
        const detectedBrowsers = await window.electronAPI.getBrowsers()

        if (detectedBrowsers?.length > 0) {
          setBrowsers(detectedBrowsers)
          if (!selectedBrowserPath) {
            setSelectedBrowserPath(detectedBrowsers[0].path)
          }
        }

        if (loadedSites?.length > 0) {
          setSites(loadedSites)
        } else {
          const defaults: Site[] = [
            { id: '1', name: 'Google', urlTemplate: 'https://google.com/search?q=[query]', joiner: '+', enabled: true },
            { id: '2', name: 'Reddit', urlTemplate: 'https://reddit.com/search?q=[query]', joiner: '+', enabled: true },
          ]
          setSites(defaults)
          await window.electronAPI.saveSites(defaults)
        }
      } catch (err: any) {
        console.error('Failed to load sites:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const handleSearch = () => {
    if (!searchQuery.trim()) return

    sites.filter(s => s.enabled).forEach(site => {
      const q = searchQuery.trim().split(/\s+/).map(encodeURIComponent).join(site.joiner)
      const url = site.urlTemplate.replace('[query]', q)
      window.electronAPI.openUrl(url, selectedBrowserPath)
    })
  }

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-[#020617]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
        <span className="text-blue-400 font-medium tracking-widest text-sm uppercase">Initializing Systems</span>
      </div>
    </div>
  )

  if (error) return (
    <div className="flex flex-col h-screen items-center justify-center p-8 text-center bg-[#020617]">
      <div className="glass-panel p-10 max-w-md border-red-500/20">
        <div className="text-red-500 mb-6 flex justify-center"><X size={64} className="p-4 bg-red-500/10 rounded-full" /></div>
        <h2 className="text-2xl font-bold mb-3 text-white">System Error</h2>
        <p className="text-slate-400 mb-8 text-sm leading-relaxed">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="glow-button px-8 py-3 w-full"
        >
          Re-initialize
        </button>
      </div>
    </div>
  )

  return (
    <div className="flex flex-col h-screen select-none bg-transparent overflow-hidden">
      <AddSiteModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={addSite} />

      {/* Header Container */}
      <header className="drag-region flex justify-between items-center px-8 py-6 z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center text-white shadow-[0_0_20px_rgba(56,189,248,0.3)]">
            <Globe size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight leading-none uppercase">NoporSearch</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              <span className="text-[10px] text-blue-400/80 font-bold uppercase tracking-widest">Premium Interface v2</span>
            </div>
          </div>
        </div>

        <div className="no-drag flex gap-6 items-center">
          {/* Custom Browser Selector */}
          <div className="relative group">
            <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl px-4 py-2 flex items-center gap-3 hover:border-blue-500/50 transition-all cursor-pointer">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Browser</span>
              <select
                className="bg-transparent text-sm text-slate-200 outline-none cursor-pointer appearance-none pr-8 font-bold min-w-[140px]"
                value={selectedBrowserPath}
                onChange={(e) => setSelectedBrowserPath(e.target.value)}
              >
                {browsers.map(b => (
                  <option key={b.name} value={b.path} className="bg-slate-900 text-slate-200">
                    {b.name}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-4 text-slate-500 pointer-events-none group-hover:text-blue-400 transition-colors" />
            </div>
          </div>

          <nav className="flex gap-2 bg-slate-900/40 p-1.5 rounded-2xl border border-slate-800/50 backdrop-blur-md">
            <button
              onClick={() => setActiveTab('search')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl transition-all text-sm font-bold uppercase tracking-wider ${activeTab === 'search' ? 'bg-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <Search size={16} /> <span>Search</span>
            </button>
            <button
              onClick={() => setActiveTab('manage')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl transition-all text-sm font-bold uppercase tracking-wider ${activeTab === 'manage' ? 'bg-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <Settings size={16} /> <span>Manage</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main content - Spacing adjusted for visual flow */}
      <main className="flex-1 flex flex-col items-center px-8 pb-8 overflow-hidden relative z-0">
        <div className="w-full max-w-5xl h-full flex flex-col">
          {activeTab === 'search' && (
            <div className="flex flex-col h-full justify-center animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="w-full max-w-3xl mx-auto mb-16">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-[2rem] blur opacity-25 group-focus-within:opacity-60 transition duration-500"></div>
                  <div className="relative">
                    <input
                      type="text"
                      autoFocus
                      placeholder="What are you looking for?"
                      className="w-full bg-[#020617]/90 border border-slate-800 text-2xl py-8 pl-24 pr-40 text-white rounded-[1.8rem] outline-none transition-all placeholder:text-slate-600 font-medium"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-blue-500/50 group-focus-within:text-blue-400 transition-colors" size={32} />
                    <button
                      onClick={handleSearch}
                      className="absolute right-4 top-1/2 -translate-y-1/2 glow-button px-10 py-5 rounded-[1.2rem] text-lg active:scale-95"
                    >
                      Search
                    </button>
                  </div>
                </div>
              </div>

              <div className="glass-panel p-6 flex flex-col min-h-0">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-xs font-black text-blue-400 uppercase tracking-[0.2em] mb-1">Active Targets</h3>
                    <p className="text-[10px] text-slate-500 font-medium">Auto-executing queries across enabled nodes</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest bg-slate-800/50 px-2.5 py-1 rounded-lg border border-slate-700/30">
                      {sites.filter(s => s.enabled).length} Enabled
                    </span>
                  </div>
                </div>

                <div className="flex-1 w-full">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {sites.map(site => (
                      <div
                        key={site.id}
                        onClick={() => updateSite(site.id, { enabled: !site.enabled })}
                        className={`neon-chip group flex items-center justify-between px-4 py-3 min-h-[64px] border ${site.enabled ? 'active' : ''}`}
                      >
                        <div className="flex flex-col gap-0.5 min-w-0">
                          <span className={`text-xs font-black transition-colors truncate ${site.enabled ? 'text-blue-100' : 'text-slate-400 group-hover:text-slate-300'}`}>
                            {site.name}
                          </span>
                          <span className={`text-[8px] font-mono truncate max-w-[100px] ${site.enabled ? 'text-blue-400/60' : 'text-slate-600'}`}>
                            {site.urlTemplate.split('/')[2] || site.name}
                          </span>
                        </div>
                        <div className={`flex-shrink-0 w-4 h-4 rounded-md flex items-center justify-center transition-all ${site.enabled ? 'bg-blue-500 text-white shadow-[0_0_10px_rgba(59,130,246,0.6)]' : 'bg-slate-800 text-transparent border border-slate-700'}`}>
                          <Check size={10} strokeWidth={5} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'manage' && (
            <div className="h-full flex flex-col glass-panel p-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="flex justify-between items-end mb-10 pb-6 border-b border-slate-800/50">
                <div>
                  <h2 className="text-3xl font-black text-white tracking-tight uppercase">Provider Cloud</h2>
                  <p className="text-slate-400 text-sm mt-2 font-medium">Fine-tune your personal search engine matrix</p>
                </div>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="glow-button px-6 py-3 flex items-center gap-2 text-sm uppercase tracking-widest active:scale-95"
                >
                  <Plus size={18} strokeWidth={3} /> Add Node
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-4 pr-4 -mr-4">
                {/* Visual Header Grid */}
                <div className="grid grid-cols-12 gap-6 px-6 py-3 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                  <div className="col-span-1">Stat</div>
                  <div className="col-span-3">Provider Identity</div>
                  <div className="col-span-5">Query Matrix</div>
                  <div className="col-span-2 text-center">Joiner</div>
                  <div className="col-span-1 text-right">Delete</div>
                </div>

                <div className="space-y-3 pb-8">
                  {sites.map(site => (
                    <SiteCard
                      key={site.id}
                      site={site}
                      updateSite={updateSite}
                      deleteSite={deleteSite}
                    />
                  ))}
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-4 border-t border-slate-800/50 pt-8">
                <button
                  onClick={async () => await window.electronAPI.saveSites(sites)}
                  className="bg-slate-900/80 border border-slate-700/50 text-white px-10 py-4 rounded-2xl hover:bg-slate-800 hover:border-blue-500/30 transition-all font-black uppercase tracking-widest text-xs flex items-center gap-3 shadow-2xl"
                >
                  <Save size={18} className="text-blue-500" strokeWidth={3} /> Commit Changes
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Visual Accents - Ambient Glows */}
      <div className="fixed -bottom-64 -left-64 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none z-[-1]"></div>
      <div className="fixed -top-64 -right-64 w-[600px] h-[600px] bg-sky-600/10 rounded-full blur-[120px] pointer-events-none z-[-1]"></div>
    </div>
  )
}

export default App

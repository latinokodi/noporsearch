import React from 'react'
import type { Site } from '../store/useAppStore'
import { GripVertical, Trash2, Globe } from 'lucide-react'

interface SiteCardProps {
    site: Site
    updateSite: (id: string, site: Partial<Site>) => void
    deleteSite: (id: string) => void
}

export const SiteCard: React.FC<SiteCardProps> = ({ site, updateSite, deleteSite }) => {
    return (
        <div className="group flex items-center gap-6 bg-slate-900/40 p-4 border border-slate-800/50 hover:border-blue-500/30 hover:shadow-[0_0_20px_rgba(56,189,248,0.05)] transition-all rounded-2xl backdrop-blur-sm animate-in fade-in zoom-in-95 duration-300">
            <div className="flex items-center justify-center p-2 bg-slate-800/50 rounded-lg text-slate-500 group-hover:text-blue-400 transition-colors">
                <Globe size={18} />
            </div>

            <div className="flex-1 grid grid-cols-12 gap-6 items-center">
                <div className="col-span-3">
                    <input
                        className="bg-transparent border-none outline-none text-slate-100 font-bold text-sm w-full focus:bg-slate-800/50 rounded-lg px-3 py-2 transition-all placeholder:text-slate-600 focus:ring-1 focus:ring-blue-500/20"
                        value={site.name}
                        onChange={(e) => updateSite(site.id, { name: e.target.value })}
                        placeholder="Provider Name"
                    />
                </div>
                <div className="col-span-6">
                    <input
                        className="bg-transparent border-none outline-none text-slate-400 font-mono text-xs w-full focus:bg-slate-800/50 rounded-lg px-3 py-2 transition-all placeholder:text-slate-700 focus:text-blue-300 focus:ring-1 focus:ring-blue-500/20"
                        value={site.urlTemplate}
                        onChange={(e) => updateSite(site.id, { urlTemplate: e.target.value })}
                        placeholder="URL Matrix Template"
                    />
                </div>
                <div className="col-span-3 flex justify-center">
                    <input
                        className="bg-slate-800/80 border border-slate-700/50 outline-none text-blue-400 font-black text-xs w-12 text-center rounded-lg py-2 focus:border-blue-500/50 transition-all"
                        value={site.joiner}
                        onChange={(e) => updateSite(site.id, { joiner: e.target.value })}
                        placeholder="+"
                    />
                </div>
            </div>

            <div className="flex items-center gap-2">
                <button
                    onClick={() => deleteSite(site.id)}
                    className="text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-all p-2.5 rounded-xl active:scale-90"
                    title="Delete Provider"
                >
                    <Trash2 size={18} strokeWidth={2.5} />
                </button>
            </div>
        </div>
    )
}

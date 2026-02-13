import React, { useState } from 'react'
import { X, Plus, Terminal } from 'lucide-react'
import type { Site } from '../store/useAppStore'

interface AddSiteModalProps {
    isOpen: boolean
    onClose: () => void
    onSave: (site: Site) => void
}

export const AddSiteModal: React.FC<AddSiteModalProps> = ({ isOpen, onClose, onSave }) => {
    const [name, setName] = useState('')
    const [url, setUrl] = useState('')
    const [joiner, setJoiner] = useState('+')
    const [error, setError] = useState<string | null>(null)

    if (!isOpen) return null

    const validate = () => {
        if (!name.trim()) return 'Identity required: Please provide a provider name'
        if (!url.trim()) return 'Query path required: Source URL cannot be empty'
        if (!url.includes('[query]')) return 'Matrix mismatch: URL must contain [query] placeholder'
        if (!joiner) return 'Linker required: Space joiner cannot be empty'
        return null
    }

    const handleSubmit = () => {
        const errorMsg = validate()
        if (errorMsg) {
            setError(errorMsg)
            return
        }

        onSave({
            id: Date.now().toString(),
            name,
            urlTemplate: url,
            joiner,
            enabled: true
        })

        setName('')
        setUrl('')
        setJoiner('+')
        setError(null)
        onClose()
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-xl transition-all animate-in fade-in duration-300 p-6">
            <div className="bg-[#020617] w-full max-w-lg p-10 rounded-[2.5rem] shadow-[0_0_100px_rgba(0,0,0,1)] relative border border-slate-800/80 overflow-hidden">
                {/* Visual Accents */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>

                <button
                    onClick={onClose}
                    className="absolute right-8 top-8 text-slate-500 hover:text-white transition-colors bg-slate-900/50 p-2 rounded-full border border-slate-800"
                >
                    <X size={20} />
                </button>

                <div className="mb-10 text-center">
                    <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 mx-auto mb-6 border border-blue-500/20 shadow-[0_0_30px_rgba(56,189,248,0.1)]">
                        <Plus size={32} strokeWidth={3} />
                    </div>
                    <h2 className="text-3xl font-black text-white tracking-tight uppercase">New Search Node</h2>
                    <p className="text-sm text-slate-500 mt-2 font-medium">Initialize a new target in the provider matrix</p>
                </div>

                {error && (
                    <div className="mb-8 p-4 bg-red-500/5 border border-red-500/20 rounded-2xl text-red-400 text-xs font-bold uppercase tracking-widest flex items-center gap-3 animate-in shake duration-300">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
                        {error}
                    </div>
                )}

                <div className="space-y-8">
                    <div className="space-y-2">
                        <div className="flex justify-between items-center px-1">
                            <label className="text-[10px] uppercase text-slate-500 font-black tracking-[0.2em]">Node Identity</label>
                        </div>
                        <input
                            className="w-full bg-slate-900/50 border border-slate-700/50 rounded-2xl px-6 py-4 text-white placeholder:text-slate-700 focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all text-lg font-bold"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="Provider Name (e.g. Google)"
                            autoFocus
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center px-1">
                            <label className="text-[10px] uppercase text-slate-500 font-black tracking-[0.2em]">Query Path Matrix Target</label>
                        </div>
                        <div className="relative">
                            <input
                                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-2xl px-6 py-4 text-white placeholder:text-slate-700 focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all text-sm font-mono"
                                value={url}
                                onChange={e => setUrl(e.target.value)}
                                placeholder="https://endpoint.com/search?q=[query]"
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                <span className="bg-blue-500/10 text-blue-400 text-[9px] font-black px-2 py-1 rounded border border-blue-500/20 uppercase tracking-tighter">[query] ready</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[10px] uppercase text-slate-500 font-black tracking-[0.2em] px-1">Space Linker</label>
                            <input
                                className="w-full bg-slate-900/50 border border-slate-700/50 rounded-2xl px-6 py-4 text-white placeholder:text-slate-700 focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all text-center text-xl font-black"
                                value={joiner}
                                onChange={e => setJoiner(e.target.value)}
                                placeholder="+"
                            />
                        </div>
                        <div className="flex items-end text-slate-500 text-[10px] leading-relaxed font-medium pb-2 italic">
                            Used to connect multi-word queries for this specific node.
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-3 mt-12 pt-8 border-t border-slate-800/50">
                    <button
                        onClick={handleSubmit}
                        className="glow-button w-full py-5 rounded-[1.2rem] text-sm font-black uppercase tracking-widest flex items-center justify-center gap-3 active:scale-[0.98]"
                    >
                        <Terminal size={18} /> Initialize Node
                    </button>
                    <button
                        onClick={onClose}
                        className="w-full py-4 text-slate-500 hover:text-slate-300 text-xs font-black uppercase tracking-widest transition-colors"
                    >
                        Abort Protocol
                    </button>
                </div>
            </div>
        </div>
    )
}

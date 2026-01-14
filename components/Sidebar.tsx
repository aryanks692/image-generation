
import React from 'react';
import { AspectRatio } from '../types';

interface SidebarProps {
  prompt: string;
  setPrompt: (p: string) => void;
  aspectRatio: AspectRatio;
  setAspectRatio: (r: AspectRatio) => void;
  isHighQuality: boolean;
  setIsHighQuality: (v: boolean) => void;
  isGenerating: boolean;
  onGenerate: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  prompt,
  setPrompt,
  aspectRatio,
  setAspectRatio,
  isHighQuality,
  setIsHighQuality,
  isGenerating,
  onGenerate
}) => {
  const ratios: { label: string; value: AspectRatio; icon: string }[] = [
    { label: "1:1 Square", value: "1:1", icon: "fa-square" },
    { label: "16:9 Cinema", value: "16:9", icon: "fa-film" },
    { label: "9:16 Mobile", value: "9:16", icon: "fa-mobile-screen" },
    { label: "3:4 Photo", value: "3:4", icon: "fa-camera" },
    { label: "4:3 Classic", value: "4:3", icon: "fa-desktop" },
  ];

  const handleSurpriseMe = () => {
    const prompts = [
      "A futuristic solarpunk city floating in the clouds with lush hanging gardens",
      "Macro photography of a crystal butterfly resting on a bioluminescent mushroom",
      "Cyberpunk street market in Tokyo at night, neon reflections in puddles",
      "An oil painting of an astronaut playing a cello on the surface of Mars",
      "Hyper-realistic portrait of an ancient sorceress with eyes made of galaxies"
    ];
    setPrompt(prompts[Math.floor(Math.random() * prompts.length)]);
  };

  return (
    <aside className="w-full md:w-[420px] h-auto md:h-screen glass border-r border-white/10 p-6 flex flex-col gap-8 z-40">
      <div className="space-y-4">
        <div className="flex justify-between items-end">
          <label className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Prompt</label>
          <button 
            onClick={handleSurpriseMe}
            className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
          >
            <i className="fas fa-random"></i> Surprise Me
          </button>
        </div>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe what you want to see..."
          className="w-full h-32 bg-slate-900/50 border border-white/10 rounded-xl p-4 text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all resize-none placeholder:text-slate-600"
        />
      </div>

      <div className="space-y-4">
        <label className="text-sm font-semibold text-slate-400 uppercase tracking-wider block">Aspect Ratio</label>
        <div className="grid grid-cols-2 gap-2">
          {ratios.map((r) => (
            <button
              key={r.value}
              onClick={() => setAspectRatio(r.value)}
              className={`flex items-center gap-3 p-3 rounded-lg border text-sm transition-all ${
                aspectRatio === r.value 
                ? 'bg-blue-600/20 border-blue-500 text-white' 
                : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'
              }`}
            >
              <i className={`fas ${r.icon} text-xs`}></i>
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
          <div>
            <h4 className="text-sm font-semibold text-white">Pro Quality (HD)</h4>
            <p className="text-[10px] text-slate-500 leading-tight">Requires higher token usage & custom API key</p>
          </div>
          <button
            onClick={() => setIsHighQuality(!isHighQuality)}
            className={`w-12 h-6 rounded-full relative transition-colors ${isHighQuality ? 'bg-blue-500' : 'bg-slate-700'}`}
          >
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isHighQuality ? 'left-7' : 'left-1'}`}></div>
          </button>
        </div>
        {isHighQuality && (
           <p className="text-[10px] text-blue-400 italic">
             <i className="fas fa-info-circle mr-1"></i> You'll be prompted to select a paid project API key.
           </p>
        )}
      </div>

      <div className="mt-auto pt-6 border-t border-white/10 space-y-4">
        <button
          onClick={onGenerate}
          disabled={isGenerating || !prompt.trim()}
          className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all ${
            isGenerating || !prompt.trim()
            ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-500/25 text-white'
          }`}
        >
          {isGenerating ? (
            <>
              <div className="spinner"></div>
              <span>Dreaming...</span>
            </>
          ) : (
            <>
              <i className="fas fa-bolt"></i>
              <span>Generate Image</span>
            </>
          )}
        </button>
        
        <p className="text-[11px] text-center text-slate-500 px-4 leading-relaxed">
          Powered by Gemini 2.5/3 Pro Image Models. Images are generated in real-time based on your creative direction.
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;

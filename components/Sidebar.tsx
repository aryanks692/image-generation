import React from 'react';
import { AspectRatio, ImageSize } from '../types';

interface SidebarProps {
  prompt: string;
  setPrompt: (p: string) => void;
  aspectRatio: AspectRatio;
  setAspectRatio: (r: AspectRatio) => void;
  imageSize: ImageSize;
  setImageSize: (s: ImageSize) => void;
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
  imageSize,
  setImageSize,
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

  const sizes: ImageSize[] = ["1K", "2K", "4K"];

  const handleSurpriseMe = () => {
    const prompts = [
      "A solarpunk paradise with glass skyscrapers covered in lush greenery, waterfalls cascading from balconies, golden hour lighting.",
      "Cinematic close-up of a futuristic samurai wearing ornate neon-lit armor in a rainy Tokyo alleyway, 8k resolution.",
      "A mystical forest where the trees are made of glowing blue crystals and small spirit foxes play in the iridescent fog.",
      "An underwater city designed like a giant nautilus shell, bio-luminescent sea life everywhere, deep blue atmosphere.",
      "Epic space opera scene: a fleet of majestic starships orbiting a dying star that is turning into a colorful nebula.",
      "Art Deco style poster of a robot playing a grand piano in a jazz club, gold and marble textures.",
      "Vibrant oil painting of a cottagecore village in the clouds with airships tethered to giant floating sunflowers."
    ];
    setPrompt(prompts[Math.floor(Math.random() * prompts.length)]);
  };

  return (
    <aside className="w-full md:w-[400px] h-auto md:h-screen glass border-r border-white/10 p-6 flex flex-col gap-6 z-40 overflow-y-auto">
      <div className="md:hidden flex justify-between items-center mb-2">
        <h1 className="text-xl font-bold gradient-text">LuminaArt</h1>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-end">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Creative Prompt</label>
          <button 
            onClick={handleSurpriseMe}
            className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
          >
            <i className="fas fa-magic"></i> Surprise Me
          </button>
        </div>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="What do you want to create?"
          className="w-full h-28 bg-slate-900/80 border border-white/10 rounded-xl p-4 text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all resize-none placeholder:text-slate-600"
        />
      </div>

      <div className="space-y-3">
        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">Aspect Ratio</label>
        <div className="grid grid-cols-2 gap-2">
          {ratios.map((r) => (
            <button
              key={r.value}
              onClick={() => setAspectRatio(r.value)}
              className={`flex items-center gap-2 p-2.5 rounded-lg border text-xs font-medium transition-all ${
                aspectRatio === r.value 
                ? 'bg-blue-600/20 border-blue-500 text-white shadow-lg shadow-blue-500/10' 
                : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'
              }`}
            >
              <i className={`fas ${r.icon} opacity-60`}></i>
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4 pt-2">
        <div className={`p-4 rounded-xl border transition-all ${isHighQuality ? 'bg-blue-600/10 border-blue-500/30' : 'bg-white/5 border-white/5'}`}>
          <div className="flex items-center justify-between mb-2">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                Pro Studio <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400">Gemini 3</span>
              </h4>
              <p className="text-[10px] text-slate-500 uppercase tracking-tighter">Ultra High Definition</p>
            </div>
            <button
              onClick={() => setIsHighQuality(!isHighQuality)}
              className={`w-11 h-6 rounded-full relative transition-colors ${isHighQuality ? 'bg-blue-500' : 'bg-slate-700'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${isHighQuality ? 'left-6' : 'left-1'}`}></div>
            </button>
          </div>
          
          {isHighQuality && (
            <div className="mt-4 pt-4 border-t border-white/10 animate-in fade-in slide-in-from-top-2 duration-300">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Output Resolution</label>
              <div className="flex gap-2">
                {sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setImageSize(size)}
                    className={`flex-1 py-1.5 rounded-md text-[10px] font-bold border transition-all ${
                      imageSize === size 
                      ? 'bg-white text-slate-900 border-white' 
                      : 'bg-transparent border-white/20 text-white/60 hover:border-white/40'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-auto pt-6 border-t border-white/10 space-y-4">
        <button
          onClick={onGenerate}
          disabled={isGenerating || !prompt.trim()}
          className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all ${
            isGenerating || !prompt.trim()
            ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:brightness-110 hover:scale-[1.01] active:scale-[0.99] shadow-xl shadow-blue-500/20 text-white'
          }`}
        >
          {isGenerating ? (
            <>
              <div className="spinner"></div>
              <span className="animate-pulse">Synthesizing...</span>
            </>
          ) : (
            <>
              <i className="fas fa-sparkles"></i>
              <span>Create Vision</span>
            </>
          )}
        </button>
        
        <div className="flex justify-center gap-4 text-[10px] text-slate-500 uppercase font-bold tracking-widest">
           <span>Model: {isHighQuality ? 'G3 Pro' : 'G2.5 Flash'}</span>
           <span className="opacity-30">|</span>
           <span>Studio v1.2</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
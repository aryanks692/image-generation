import React from 'react';
import { GeneratedImage } from '../types';

interface HistoryPanelProps {
  images: GeneratedImage[];
  activeImageId: string | null;
  onClear: () => void;
  onSelect: (img: GeneratedImage) => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ images, activeImageId, onClear, onSelect }) => {
  if (images.length === 0) return null;

  return (
    <div className="w-full glass border-t border-white/10 p-5 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-4 px-2">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
          Generation History
        </h3>
        <button 
          onClick={onClear}
          className="text-[10px] text-slate-500 hover:text-red-400 transition-colors uppercase font-black tracking-widest"
        >
          Wipe Data
        </button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide px-2">
        {images.map((img) => (
          <div 
            key={img.id}
            onClick={() => onSelect(img)}
            className="flex-shrink-0 group cursor-pointer relative"
          >
            <div className={`w-28 h-28 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
              activeImageId === img.id 
              ? 'border-blue-500 shadow-lg shadow-blue-500/30 scale-105' 
              : 'border-white/5 opacity-60 hover:opacity-100 hover:border-white/20'
            }`}>
              <img 
                src={img.url} 
                alt={img.prompt} 
                className="w-full h-full object-cover"
              />
            </div>
            {activeImageId === img.id && (
              <div className="absolute -top-1 -right-1 bg-blue-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] shadow-lg">
                <i className="fas fa-check"></i>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryPanel;
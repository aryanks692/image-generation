
import React from 'react';
import { GeneratedImage } from '../types';

interface HistoryPanelProps {
  images: GeneratedImage[];
  onClear: () => void;
  onSelect: (img: GeneratedImage) => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ images, onClear, onSelect }) => {
  if (images.length === 0) return null;

  return (
    <div className="w-full glass border-t border-white/10 p-6 animate-in slide-in-from-bottom duration-500">
      <div className="flex justify-between items-center mb-4 px-2">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <i className="fas fa-history text-xs"></i> Recent Generations
        </h3>
        <button 
          onClick={onClear}
          className="text-xs text-slate-500 hover:text-red-400 transition-colors uppercase font-bold"
        >
          Clear All
        </button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide px-2">
        {images.map((img) => (
          <div 
            key={img.id}
            onClick={() => onSelect(img)}
            className="flex-shrink-0 group cursor-pointer relative"
          >
            <div className="w-32 h-32 rounded-xl overflow-hidden border border-white/5 hover:border-blue-500/50 transition-all">
              <img 
                src={img.url} 
                alt={img.prompt} 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
              />
            </div>
            <div className="absolute inset-0 bg-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
              <i className="fas fa-eye text-white text-lg"></i>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryPanel;

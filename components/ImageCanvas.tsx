
import React from 'react';
import { GeneratedImage } from '../types';

interface ImageCanvasProps {
  currentImage?: GeneratedImage;
  isGenerating: boolean;
  error: string | null;
}

const ImageCanvas: React.FC<ImageCanvasProps> = ({ currentImage, isGenerating, error }) => {
  const getAspectRatioClass = (ratio: string) => {
    switch(ratio) {
      case '16:9': return 'aspect-video';
      case '9:16': return 'aspect-[9/16] h-[600px]';
      case '3:4': return 'aspect-[3/4]';
      case '4:3': return 'aspect-[4/3]';
      default: return 'aspect-square';
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center space-y-4 max-w-md animate-in fade-in zoom-in duration-300">
        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 text-2xl">
          <i className="fas fa-circle-exclamation"></i>
        </div>
        <h3 className="text-xl font-bold text-white">Oops! Something went wrong</h3>
        <p className="text-slate-400 text-sm">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm font-medium transition-all"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={`relative w-full max-w-4xl transition-all duration-700 ${isGenerating ? 'opacity-50 blur-sm' : 'opacity-100'}`}>
      {isGenerating && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 bg-slate-950/20 backdrop-blur-[2px]">
          <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-blue-400 animate-pulse">Consulting the neural networks...</p>
        </div>
      )}

      {!currentImage && !isGenerating ? (
        <div className="w-full aspect-square md:aspect-video flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-3xl bg-white/5">
          <div className="w-20 h-20 rounded-2xl bg-slate-900 flex items-center justify-center mb-6">
            <i className="fas fa-image text-slate-700 text-4xl"></i>
          </div>
          <h2 className="text-2xl font-bold text-slate-500 mb-2">No Image Generated Yet</h2>
          <p className="text-slate-600 max-w-xs text-center text-sm leading-relaxed">
            Enter a prompt in the sidebar and click generate to bring your imagination to life.
          </p>
        </div>
      ) : (
        <div className={`relative group w-full mx-auto shadow-2xl shadow-blue-500/10 rounded-2xl overflow-hidden border border-white/10 bg-slate-900 ${currentImage ? getAspectRatioClass(currentImage.aspectRatio) : ''}`}>
          {currentImage && (
            <>
              <img 
                src={currentImage.url} 
                alt={currentImage.prompt}
                className="w-full h-full object-contain md:object-cover animate-in fade-in duration-1000"
              />
              
              {/* Overlay Actions */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <div className="flex justify-between items-end">
                  <div className="max-w-[70%]">
                    <p className="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-1">Generated Prompt</p>
                    <p className="text-white text-sm line-clamp-2">{currentImage.prompt}</p>
                  </div>
                  <div className="flex gap-2">
                    <a 
                      href={currentImage.url} 
                      download={`luminaart-${currentImage.id}.png`}
                      className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white text-white hover:text-black flex items-center justify-center transition-all"
                      title="Download Image"
                    >
                      <i className="fas fa-download"></i>
                    </a>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageCanvas;

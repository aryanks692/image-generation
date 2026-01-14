
import React, { useState, useEffect, useCallback } from 'react';
import { generateAIImage } from './services/geminiService';
import { AspectRatio, GeneratedImage, GenerationConfig, ModelName } from './types';
import Sidebar from './components/Sidebar';
import ImageCanvas from './components/ImageCanvas';
import HistoryPanel from './components/HistoryPanel';
import Header from './components/Header';

const App: React.FC = () => {
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("1:1");
  const [isHighQuality, setIsHighQuality] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!currentPrompt.trim()) return;

    setError(null);

    // High Quality selection logic
    if (isHighQuality) {
      try {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        if (!hasKey) {
          await window.aistudio.openSelectKey();
          // Assume success as per guidelines
        }
      } catch (e) {
        console.error("API Key selection error:", e);
        setError("Please select a valid API key for high-quality generation.");
        return;
      }
    }

    setIsGenerating(true);

    try {
      const imageUrl = await generateAIImage({
        prompt: currentPrompt,
        aspectRatio,
        isHighQuality
      });

      const newImage: GeneratedImage = {
        id: Date.now().toString(),
        url: imageUrl,
        prompt: currentPrompt,
        timestamp: Date.now(),
        aspectRatio,
        model: isHighQuality ? ModelName.PRO : ModelName.FLASH
      };

      setImages(prev => [newImage, ...prev]);
    } catch (err: any) {
      let msg = "Generation failed. Please try again.";
      if (err.message?.includes("Requested entity was not found")) {
        msg = "Project settings mismatch. Please re-select your API key.";
        if (isHighQuality) await window.aistudio.openSelectKey();
      }
      setError(msg);
    } finally {
      setIsGenerating(false);
    }
  };

  const clearHistory = () => setImages([]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row overflow-hidden bg-slate-950">
      {/* Mobile Header */}
      <div className="md:hidden p-4 border-b border-white/10 glass flex justify-between items-center z-50">
        <h1 className="text-xl font-bold gradient-text">LuminaArt</h1>
        <button className="text-white/60 hover:text-white">
          <i className="fas fa-bars text-xl"></i>
        </button>
      </div>

      {/* Sidebar Controls */}
      <Sidebar 
        prompt={currentPrompt}
        setPrompt={setCurrentPrompt}
        aspectRatio={aspectRatio}
        setAspectRatio={setAspectRatio}
        isHighQuality={isHighQuality}
        setIsHighQuality={setIsHighQuality}
        isGenerating={isGenerating}
        onGenerate={handleGenerate}
      />

      {/* Main Display Area */}
      <main className="flex-1 flex flex-col h-full relative overflow-y-auto">
        <Header />
        
        <div className="flex-1 p-6 md:p-10 flex flex-col items-center justify-center">
          <ImageCanvas 
            currentImage={images[0]} 
            isGenerating={isGenerating} 
            error={error}
          />
        </div>

        {/* Bottom History (Horizontal on large screens) */}
        <HistoryPanel 
          images={images} 
          onClear={clearHistory} 
          onSelect={(img) => {
             // Logic to "re-view" or handle selection if needed
          }}
        />
      </main>
    </div>
  );
};

export default App;

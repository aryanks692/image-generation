import React, { useState } from 'react';
import { generateAIImage } from './services/geminiService';
import { AspectRatio, GeneratedImage, ModelName, ImageSize } from './types';
import Sidebar from './components/Sidebar';
import ImageCanvas from './components/ImageCanvas';
import HistoryPanel from './components/HistoryPanel';
import Header from './components/Header';

const App: React.FC = () => {
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [activeImageId, setActiveImageId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("1:1");
  const [imageSize, setImageSize] = useState<ImageSize>("1K");
  const [isHighQuality, setIsHighQuality] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activeImage = images.find(img => img.id === activeImageId) || images[0];

  const handleGenerate = async () => {
    if (!currentPrompt.trim()) return;
    setError(null);

    // FIXED: Using process.env.API_KEY as per project requirements
    const apiKey = process.env.API_KEY;

    if (isHighQuality || !apiKey) {
      if (window.aistudio) {
        try {
          const hasKey = await window.aistudio.hasSelectedApiKey();
          if (!hasKey) {
            await window.aistudio.openSelectKey();
          }
        } catch (e) {
          console.error("Key selection error:", e);
        }
      } else if (!apiKey) {
        setError("API Key is missing. Please ensure an API key is available in your environment or via the selector.");
        return;
      }
    }

    setIsGenerating(true);

    try {
      const imageUrl = await generateAIImage({
        prompt: currentPrompt,
        aspectRatio,
        isHighQuality,
        imageSize
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
      setActiveImageId(newImage.id);
    } catch (err: any) {
      console.error("Generation error:", err);
      let msg = err.message || "Generation failed. Please try again.";

      if (err.message?.includes("Requested entity was not found")) {
        msg = "Project configuration error. Please re-select your API key.";
        if (window.aistudio) await window.aistudio.openSelectKey();
      }

      setError(msg);
    } finally {
      setIsGenerating(false);
    }
  };

  const clearHistory = () => {
    setImages([]);
    setActiveImageId(null);
  };

  const handleSelectImage = (img: GeneratedImage) => {
    setActiveImageId(img.id);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row overflow-hidden bg-slate-950 text-slate-200">
      <Sidebar 
        prompt={currentPrompt}
        setPrompt={setCurrentPrompt}
        aspectRatio={aspectRatio}
        setAspectRatio={setAspectRatio}
        imageSize={imageSize}
        setImageSize={setImageSize}
        isHighQuality={isHighQuality}
        setIsHighQuality={setIsHighQuality}
        isGenerating={isGenerating}
        onGenerate={handleGenerate}
      />

      <main className="flex-1 flex flex-col h-full relative overflow-y-auto">
        <Header />
        
        <div className="flex-1 p-6 md:p-10 flex flex-col items-center justify-center">
          <ImageCanvas 
            currentImage={activeImage} 
            isGenerating={isGenerating} 
            error={error}
          />
        </div>

        <HistoryPanel 
          images={images} 
          activeImageId={activeImageId || (images[0]?.id)}
          onClear={clearHistory} 
          onSelect={handleSelectImage}
        />
      </main>
    </div>
  );
};

export default App;

import React, { useState, useEffect } from 'react';
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

    // API Key selection is mandatory for high-quality models like gemini-3-pro-image-preview
    if (isHighQuality) {
      try {
        const hasKey = await window.aistudio?.hasSelectedApiKey();
        if (!hasKey) {
          await window.aistudio?.openSelectKey();
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
      let msg = "Generation failed. Please try again.";
      // If the error suggests project/entity issues, prompt for key re-selection
      if (err.message?.includes("Requested entity was not found")) {
        msg = "Project settings mismatch. Please re-select your API key.";
        await window.aistudio?.openSelectKey();
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
    <div className="min-h-screen flex flex-col md:flex-row overflow-hidden bg-slate-950">
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

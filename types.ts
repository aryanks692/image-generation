
export type AspectRatio = "1:1" | "3:4" | "4:3" | "9:16" | "16:9";
export type ImageSize = "1K" | "2K" | "4K";

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  timestamp: number;
  aspectRatio: AspectRatio;
  model: string;
}

export interface GenerationConfig {
  prompt: string;
  aspectRatio: AspectRatio;
  isHighQuality: boolean;
  imageSize?: ImageSize;
}

export enum ModelName {
  FLASH = 'gemini-2.5-flash-image',
  PRO = 'gemini-3-pro-image-preview'
}

declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }

  interface Window {
    // Marked as optional to ensure compatibility with environmental type definitions
    aistudio?: AIStudio;
  }
}


import { GoogleGenAI } from "@google/genai";
import { GenerationConfig, ModelName } from "../types";

export const generateAIImage = async (config: GenerationConfig): Promise<string> => {
  const { prompt, aspectRatio, isHighQuality, imageSize = "1K" } = config;
  
  // Fix: Create a new instance right before the call and use process.env.API_KEY directly as per guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const model = isHighQuality ? ModelName.PRO : ModelName.FLASH;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: {
          aspectRatio,
          ...(isHighQuality ? { imageSize } : {})
        }
      },
    });

    // Find the image part in candidates
    const candidate = response.candidates?.[0];
    if (!candidate?.content?.parts) {
      throw new Error("No image generated in response parts.");
    }

    for (const part of candidate.content.parts) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }

    throw new Error("Could not find image data in the response.");
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
import { GoogleGenAI } from "@google/genai";
import { GenerationConfig, ModelName } from "../types";

export const generateAIImage = async (config: GenerationConfig): Promise<string> => {
  const { prompt, aspectRatio, isHighQuality, imageSize = "1K" } = config;
  
  // Create a fresh instance right before the call to ensure it uses the latest API key
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
  
  const modelName = isHighQuality ? ModelName.PRO : ModelName.FLASH;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
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

    const candidate = response.candidates?.[0];
    if (!candidate?.content?.parts) {
      throw new Error("The model did not return any image data. Try refining your prompt.");
    }

    // Find the image part (inlineData) in the response parts
    for (const part of candidate.content.parts) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }

    throw new Error("No image data found in the response.");
  } catch (error: any) {
    console.error("Gemini Image Generation Error:", error);
    throw error;
  }
};

import { GoogleGenAI } from "@google/genai";
import { MomentFilter, UserPhoto } from "../types";

export const transformImage = async (photo: UserPhoto, filter: MomentFilter): Promise<string> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please set GEMINI_API_KEY in your environment variables.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const base64Data = photo.dataUrl.split(',')[1];
  
  const prompt = `You are a world-class sports photographer and digital artist. 
    TASK: ${filter.prompt}
    
    VISUAL REQUIREMENTS:
    - LIGHTING & COLOR: Use natural but cinematic professional sports photography grading.
    - CONTRAST: High dynamic range typical of premium sports broadcasts.
    
    CLOTHING & ACCESSORIES TRANSFORMATION:
    - FOR EVERY PERSON VISIBLE: Transform their current clothing into a high-fidelity, realistic professional soccer jersey.
    - HATS: Add a realistic professional soccer team baseball cap or hat onto each person's head. The hat should look like it's being naturally worn and match the lighting of the scene.
    - PLURALITY: If there are multiple people, EVERYONE must be wearing an authentic soccer jersey and a team hat.
    
    STRICT CONSTRAINTS:
    - FACES: Absolutely DO NOT change the facial features, eyes, or expressions. They must remain 100% authentic and recognizable. You may place the hat naturally over the hair/head.
    - FOCUS: Maintain a medium-to-close framing so the details of the jerseys, hats, and the people are prominent.
    - STYLE: Apply professional color grading, stadium atmospheric haze, and motion-blur artifacts.
    - NO TEXT: Do not generate any text, logos, or digital overlays in the image itself.`;

  // Try multiple models in case one has quota issues
  const models = [
    'gemini-2.0-flash-exp-image-generation',
    'gemini-2.5-flash-preview-image-generation', 
    'gemini-2.5-flash-image'
  ];
  
  let lastError: Error | null = null;
  
  for (const model of models) {
    try {
      console.log(`Trying model: ${model}`);
      
      const response = await ai.models.generateContent({
        model,
        contents: {
          parts: [
            {
              inlineData: {
                data: base64Data,
                mimeType: photo.mimeType,
              },
            },
            { text: prompt },
          ],
        },
      });

      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    } catch (error: any) {
      console.warn(`Model ${model} failed:`, error.message);
      lastError = error;
      
      // If it's a quota error, try the next model
      if (error.message?.includes('429') || error.message?.includes('quota')) {
        continue;
      }
      
      // For other errors, throw immediately
      throw error;
    }
  }

  // If we get here, all models failed
  if (lastError?.message?.includes('429') || lastError?.message?.includes('quota')) {
    throw new Error("API quota exceeded. Please try again later or use a different API key.");
  }
  
  throw lastError || new Error("Transformation failed. No image returned.");
};

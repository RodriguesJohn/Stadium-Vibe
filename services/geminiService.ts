
import { GoogleGenAI } from "@google/genai";
import { MomentFilter, UserPhoto } from "../types";

export const transformImage = async (photo: UserPhoto, filter: MomentFilter): Promise<string> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please ensure process.env.API_KEY is configured.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const base64Data = photo.dataUrl.split(',')[1];
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          inlineData: {
            data: base64Data,
            mimeType: photo.mimeType,
          },
        },
        {
          text: `You are a world-class sports photographer and digital artist. 
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
          - NO TEXT: Do not generate any text, logos, or digital overlays in the image itself.`
        },
      ],
    },
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  }

  throw new Error("Transformation failed. No image returned.");
};

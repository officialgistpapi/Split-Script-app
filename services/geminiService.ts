
import { GoogleGenAI, Type } from "@google/genai";
import { TextChunk } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

/**
 * Uses Gemini 3 Flash to intelligently split text at the best possible locations 
 * (sentence endings) while adhering to strict character limits.
 */
export const smartSplitWithGemini = async (text: string, limit: number): Promise<TextChunk[]> => {
  if (!process.env.API_KEY || text.length < limit) {
    const { splitTextAlgorithmic } = await import('../utils/textUtils');
    return splitTextAlgorithmic(text, limit);
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are a professional text-processing tool. 
      Your job is to split the following script into multiple chunks.
      
      STRICT RULES:
      1. Each chunk must be NO LONGER than ${limit} characters.
      2. DO NOT BREAK SENTENCES. A sentence must stay entirely within one chunk.
      3. The ONLY exception to Rule 2 is if a single sentence is longer than ${limit} characters. In that specific case, split that sentence at a word boundary.
      4. Do NOT cut words in half.
      5. Output chunks in their original chronological order.
      6. Do not add, remove, or summarize ANY content.
      7. Preserve all original punctuation and internal spacing.
      
      SCRIPT:
      ${text}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              content: {
                type: Type.STRING,
                description: 'The full text of this chunk.',
              }
            },
            required: ["content"]
          },
        },
      },
    });

    const result = JSON.parse(response.text || '[]');
    return result.map((item: any, index: number) => ({
      id: index + 1,
      content: item.content,
      charCount: item.content.length
    }));
  } catch (error) {
    console.error("Gemini smart split failed, falling back to algorithm:", error);
    const { splitTextAlgorithmic } = await import('../utils/textUtils');
    return splitTextAlgorithmic(text, limit);
  }
};

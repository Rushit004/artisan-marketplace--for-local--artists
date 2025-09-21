import { GoogleGenAI } from "@google/genai";
import type { ArtisanProfile, Product } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Converts a File object to a base64 encoded string.
 * @param file The file to convert.
 * @returns A promise that resolves with the base64 string.
 */
const fileToGenerativePart = async (file: File): Promise<{ inlineData: { data: string; mimeType: string; } }> => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result.split(',')[1]);
      } else {
        resolve(''); // Should not happen with readAsDataURL
      }
    };
    reader.readAsDataURL(file);
  });
  const data = await base64EncodedDataPromise;
  return {
    inlineData: {
      data,
      mimeType: file.type,
    },
  };
};

/**
 * Generates a product description using Gemini.
 * @param imageFile The product image.
 * @param keywords Keywords for the product.
 * @param craftType The type of craft.
 * @returns A promise that resolves with the generated description string.
 */
export const generateProductDescription = async (
  imageFile: File,
  keywords: string,
  craftType: string
): Promise<string> => {
  try {
    const imagePart = await fileToGenerativePart(imageFile);
    const prompt = `You are a marketing expert for an online artisan marketplace. 
    Generate a compelling, SEO-friendly product description for a new listing. 
    Be evocative, detailed, and focus on the craftsmanship. 
    
    Craft Type: ${craftType}
    Keywords to include: ${keywords}

    Based on the image provided, write a description that includes:
    1. A catchy title (start with "Title:").
    2. A main description (2-3 paragraphs).
    3. A bulleted list of key features (materials, dimensions if inferable, unique aspects).
    
    Do not add any other formatting like markdown headers.
    `;

    const textPart = { text: prompt };

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [imagePart, textPart] },
    });

    return response.text;
  } catch (error) {
    console.error("Error generating product description:", error);
    throw new Error("Failed to generate product description. Please check your API key and try again.");
  }
};

/**
 * Generates personalized suggestions for an artisan.
 * @param profile The artisan's profile.
 * @returns A promise that resolves with an array of suggestion strings.
 */
export const getArtisanSuggestions = async (profile: ArtisanProfile): Promise<string[]> => {
  try {
    const prompt = `You are a business mentor for independent artists on an e-commerce platform.
    Your client is ${profile.name}, who specializes in ${profile.specialty}.
    Provide 3-4 actionable, creative, and personalized suggestions to help them grow their business. 
    Focus on these areas:
    - A new product idea based on current trends relevant to their specialty.
    - A marketing or social media tip.
    - A collaboration idea with another type of artisan.

    Format the response as a simple list. Start each suggestion with a relevant emoji. Do not use markdown.
    `;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text.split('\n').filter(line => line.trim() !== '');
  } catch (error) {
    console.error("Error generating artisan suggestions:", error);
    throw new Error("Failed to generate suggestions. Please check your API key and try again.");
  }
};

/**
 * A generic function to get AI-powered suggestions based on a prompt.
 * Used for AI search and connection recommendations.
 * @param prompt The detailed prompt for the AI.
 * @returns A promise that resolves with an array of string results.
 */
export const getAiSourcedSuggestions = async (prompt: string): Promise<string[]> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        
        // Assuming the AI returns a JSON string array `["id1", "id2"]`
        const jsonResponse = response.text.trim();
        const parsed = JSON.parse(jsonResponse);
        if (Array.isArray(parsed)) {
            return parsed;
        }
        return [];
    } catch (error) {
        console.error("Error getting AI sourced suggestions:", error, "Prompt was:", prompt);
        // Attempt to handle non-JSON responses gracefully for connection suggestions
        if (typeof (error as SyntaxError).message === 'string' && (error as SyntaxError).message.includes('JSON')) {
             const responseText = (await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt })).text;
             return responseText.split('\n').filter(line => line.trim() !== '');
        }
        throw new Error("Failed to get AI suggestions. Please check your API key and try again.");
    }
};

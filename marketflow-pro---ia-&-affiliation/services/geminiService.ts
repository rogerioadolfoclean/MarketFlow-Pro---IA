
import { GoogleGenAI, Type } from "@google/genai";
import { MarketItem, TrendAnalysis } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getMarketTrends = async (lat?: number, lng?: number): Promise<TrendAnalysis> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Analyse de marché MULTI-UTILISATEUR. 
      1. Identifie les 10 produits les plus vendus au monde (Best Sellers).
      2. Simule une section "Choix de la Communauté" basée sur les produits les plus recherchés par les utilisateurs similaires.
      3. Pour chaque produit, estime un nombre de vues (viewCount) et de likes (likeCount) cohérent avec sa popularité.
      4. Compare les prix mondiaux (Amazon, Walmart, etc.).
      Retourne un JSON avec 'trendingItems' et 'communityPicks'.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            trendingItems: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING },
                  category: { type: Type.STRING },
                  reason: { type: Type.STRING },
                  priceEstimate: { type: Type.STRING },
                  sourcePlatform: { type: Type.STRING },
                  buyUrl: { type: Type.STRING },
                  isHotDeal: { type: Type.BOOLEAN },
                  viewCount: { type: Type.NUMBER },
                  likeCount: { type: Type.NUMBER },
                  comparisons: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        platform: { type: Type.STRING },
                        price: { type: Type.STRING },
                        url: { type: Type.STRING }
                      }
                    }
                  }
                }
              }
            },
            communityPicks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  name: { type: Type.STRING },
                  category: { type: Type.STRING },
                  viewCount: { type: Type.NUMBER },
                  priceEstimate: { type: Type.STRING }
                }
              }
            },
            categories: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    });

    const data = JSON.parse(response.text || "{}");
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map(chunk => ({
      title: chunk.web?.title || "Source",
      uri: chunk.web?.uri || ""
    })).filter(s => s.uri !== "") || [];

    return {
      trendingItems: data.trendingItems || [],
      communityPicks: data.communityPicks || [],
      categories: data.categories || [],
      lastUpdated: Date.now(),
      sources
    };
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const smartCategorize = async (itemNames: string[]): Promise<MarketItem[]> => {
  if (itemNames.length === 0) return [];
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Catégorise : ${itemNames.join(", ")}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            name: { type: Type.STRING },
            category: { type: Type.STRING },
            reason: { type: Type.STRING }
          }
        }
      }
    }
  });
  return JSON.parse(response.text || "[]");
};

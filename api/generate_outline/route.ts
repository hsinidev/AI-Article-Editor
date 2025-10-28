
import { GoogleGenAI, Type } from "@google/genai";

// Vercel Edge Functions
export const config = {
  runtime: 'edge',
};

export async function POST(req: Request) {
  try {
    const { topic, keywords } = await req.json();

    if (!topic) {
      return new Response(JSON.stringify({ error: 'Topic is required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `
      You are an expert content strategist and SEO specialist.
      Your task is to generate a comprehensive and engaging blog post outline based on a given topic and keywords.

      Topic: "${topic}"
      Keywords: "${keywords}"

      Please generate the following in a structured JSON format:
      1.  **title**: A catchy, SEO-friendly title for the blog post (around 60-70 characters).
      2.  **slug**: A URL-friendly slug for the blog post (lowercase, hyphenated).
      3.  **metaDescription**: A compelling meta description (around 150-160 characters) that encourages clicks from search results.
      4.  **outline**: A detailed outline with 8-12 logical section headings. These headings should cover the topic comprehensively, from introduction to conclusion. They should be phrased as engaging questions or statements.

      Ensure the JSON output is clean and perfectly formatted according to the schema.
    `;
    
    const response = await ai.models.generateContent({
        model: "gemini-2.5-pro",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    slug: { type: Type.STRING },
                    metaDescription: { type: Type.STRING },
                    outline: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING }
                    }
                },
                required: ["title", "slug", "metaDescription", "outline"]
            },
        },
    });

    return new Response(response.text, {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Failed to generate outline' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

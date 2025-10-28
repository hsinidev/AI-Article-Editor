
import { GoogleGenAI } from "@google/genai";

export const config = {
  runtime: 'edge',
};

export async function POST(req: Request) {
  try {
    const { topic, articleTitle } = await req.json();

    if (!topic || !articleTitle) {
      return new Response('Missing required parameters', { status: 400 });
    }
    
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `
        You are a marketing and content specialist. Your task is to write a reusable "footer" or "call to action" section for a blog post.

        **Blog Post Topic:** "${topic}"
        **Blog Post Title:** "${articleTitle}"

        **Instructions:**
        1.  **Format:** Write the content in clean HTML. Use a <div> with a border and some padding as a container. Use tags like <h3>, <p>, and maybe a button-styled <a> tag.
        2.  **Content:** Create a compelling call to action. This could be encouraging readers to subscribe to a newsletter, check out a related product/service, or follow on social media. It should be generic enough to be reusable but still feel relevant to the topic.
        3.  **Tone:** Enthusiastic and encouraging.
        4.  **Output:** Provide only the HTML for this footer section.
    `;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
    });

    return new Response(response.text, {
      headers: { 'Content-Type': 'text/html' },
    });

  } catch (error) {
    console.error(error);
    return new Response('Failed to generate footer content', { status: 500 });
  }
}

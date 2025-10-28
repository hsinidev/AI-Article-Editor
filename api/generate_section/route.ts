
import { GoogleGenAI } from "@google/genai";

export const config = {
  runtime: 'edge',
};

export async function POST(req: Request) {
  try {
    const { topic, articleTitle, sectionHeading, allHeadings } = await req.json();

    if (!topic || !articleTitle || !sectionHeading || !allHeadings) {
      return new Response('Missing required parameters', { status: 400 });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const prompt = `
      You are an expert blog post writer specializing in creating engaging, informative, and SEO-optimized content.
      Your current task is to write a single, detailed section for a blog post.

      **Overall Blog Post Topic:** "${topic}"
      **Overall Blog Post Title:** "${articleTitle}"
      **Full Article Outline (for context):**
      ${allHeadings.map((h, i) => `${i + 1}. ${h}`).join('\n')}

      ---

      **Write the content ONLY for this section heading:** "${sectionHeading}"

      **Instructions:**
      1.  **Format:** Write the content in clean HTML. Use tags like <h2> for the main heading, <p> for paragraphs, <ul>, <ol>, <li> for lists, and <strong> or <b> for emphasis. The main heading for this section should be an <h2> tag.
      2.  **Content:** The content should be comprehensive, well-researched, and provide real value to the reader. It should be approximately 300-400 words long.
      3.  **Tone:** Maintain an engaging, authoritative, yet approachable tone.
      4.  **SEO:** Naturally incorporate relevant keywords related to the topic and section heading.
      5.  **Focus:** DO NOT write an introduction or conclusion for the entire blog post. ONLY write the content for the specified section heading. Do not repeat the heading in the response if it is already wrapped in an h2 tag. Start directly with the content.
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
    return new Response('Failed to generate section content', { status: 500 });
  }
}

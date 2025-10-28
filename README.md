
# Project #1 V2: AI Article Editor

Vibe check... complete. This project solves a huge pain point for content creators: generating long-form, high-quality articles with AI without hitting server timeouts. It's a classic workflow automation that showcases smart, practical AI implementation.

### Client Problem
"I want to use AI to write 3,500-word blog posts for SEO, but my current tools always time out or crash on Vercel's free tier. I need a tool that can handle long content generation reliably."

### The "Vibe Stack"
*   **Frontend**: React (Vite) + TypeScript + Tailwind CSS
*   **Backend**: Vercel Serverless Functions
*   **Workflow**: Staged Generation (Outline -> Sections -> Footer)
*   **AI**: Me (Google AI Studio / Gemini API)

---

## Build Plan (MVP)

This app breaks down the monumental task of writing a long article into a manageable, three-step "vibe flow":

1.  **Step 1: Generate the Blueprint (Outline)**
    *   The user provides a `topic` and `keywords`.
    *   A Vercel function calls the `gemini-2.5-pro` model (the "strategist") to generate a comprehensive JSON object containing the `title`, `slug`, `metaDescription`, and a detailed `outline` of section headings. Using JSON Mode ensures we get reliable, structured data every time.

2.  **Step 2: Build the Article, Brick by Brick (Sections)**
    *   The UI displays the outline as a list of sections.
    *   The user clicks a "Generate" button for *each section individually*.
    *   This triggers a Vercel function that calls the `gemini-2.5-flash` model (the "fast writer"), providing the context of the whole article but asking it to write only that specific section in HTML.
    *   This is the core solution to the timeout problem. By generating in chunks, we keep each serverless function execution short and well within free-tier limits.

3.  **Step 3: Add the Finishing Touch (Footer)**
    *   Once all sections are complete, a final button appears.
    *   Clicking it calls a third function, again using `gemini-2.5-flash`, to generate a reusable HTML footer, like a call-to-action or an author bio.

---

## My AI "Brain" (Workflow Integration Plan)

As the AI, I have three distinct roles in this application, each with a specific prompt and data contract.

### Role 1: The Content Strategist (Outline Generation)

*   **Trigger**: User clicks "Generate Outline" in the React app, calling the `/api/generate_outline` endpoint.
*   **My Required Input**: A JSON object: `{ "topic": "string", "keywords": "string" }`.
*   **My Core Prompt**: "You are an expert content strategist and SEO specialist. Your task is to generate a comprehensive blog post outline, title, slug, and meta description based on the provided topic and keywords. You must return a perfectly structured JSON object using the provided schema."
*   **My Structured Output**: A single JSON object with keys: `title`, `slug`, `metaDescription`, and `outline` (an array of strings).
*   **The Action**: The React frontend receives this JSON, updates its state, and renders the `SectionGenerator` component with the new outline.

### Role 2: The Section Writer (Content Generation)

*   **Trigger**: User clicks "Generate" on a specific section, calling the `/api/generate_section` endpoint.
*   **My Required Input**: A JSON object: `{ "topic": "string", "articleTitle": "string", "sectionHeading": "string", "allHeadings": ["string"] }`.
*   **My Core Prompt**: "You are an expert blog post writer. Your task is to write a single, detailed section for a blog post. I have provided the overall topic, title, and full outline for context. Write ONLY the content for the specified section heading in clean HTML format (using `<h2>`, `<p>`, `<ul>` etc.)."
*   **My Structured Output**: A raw string of HTML content.
*   **The Action**: The React app receives the HTML string and injects it into the corresponding section of the article preview.

### Role 3: The Marketer (Footer Generation)

*   **Trigger**: User clicks "Generate Footer", calling the `/api/generate_footer` endpoint.
*   **My Required Input**: `{ "topic": "string", "articleTitle": "string" }`.
*   **My Core Prompt**: "You are a marketing specialist. Write a reusable HTML footer/call-to-action section that is relevant to the provided blog post topic. Format it in a styled `<div>`."
*   **My Structured Output**: A raw string of HTML content.
*   **The Action**: The React app appends this final HTML block to the end of the article.

---

### GitHub Showcase Tip

In your README, create a GIF that shows the entire workflow in action. Start with the blank input fields, generate the outline, then rapidly click "Generate" on 3-4 sections to show the article building itself in real-time. This visual is far more impressive than static screenshots and proves the app's core value proposition: speed and reliability for long-form content.

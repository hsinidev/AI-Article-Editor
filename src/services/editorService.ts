
import { ArticleOutline } from '../types';

const API_BASE_URL = '/api';

export async function generateOutline(topic: string, keywords: string): Promise<ArticleOutline> {
  const response = await fetch(`${API_BASE_URL}/generate_outline`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic, keywords }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to generate outline: ${errorText}`);
  }

  return response.json();
}

export async function generateSectionContent(topic: string, articleTitle: string, sectionHeading: string, allHeadings: string[]): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/generate_section`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic, articleTitle, sectionHeading, allHeadings }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to generate section content: ${errorText}`);
  }

  return response.text();
}

export async function generateFooter(topic: string, articleTitle: string): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/generate_footer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ topic, articleTitle }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to generate footer: ${errorText}`);
  }

  return response.text();
}


export interface ArticleOutline {
  title: string;
  slug: string;
  metaDescription: string;
  outline: string[];
}

export interface ArticleSection {
  heading: string;
  content: string;
  isGenerating: boolean;
}

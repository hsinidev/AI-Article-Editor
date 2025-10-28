
import React, { useState, useMemo } from 'react';
import { generateOutline, generateSectionContent, generateFooter } from './services/editorService';
import SectionGenerator from './components/SectionGenerator';
import LoadingSpinner from './components/LoadingSpinner';
import { ArticleOutline, ArticleSection } from './types';
import { FileText, Wand2, BotMessageSquare, Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [topic, setTopic] = useState<string>('How to build a SaaS with React and Vercel');
  const [keywords, setKeywords] = useState<string>('SaaS, React, Vercel, Next.js, AI, Gemini');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [outline, setOutline] = useState<ArticleOutline | null>(null);
  const [sections, setSections] = useState<ArticleSection[]>([]);
  const [footer, setFooter] = useState<string>('');
  const [isGeneratingFooter, setIsGeneratingFooter] = useState<boolean>(false);
  
  const isGeneratingAnything = useMemo(() => {
    return isLoading || sections.some(s => s.isGenerating) || isGeneratingFooter;
  }, [isLoading, sections, isGeneratingFooter]);

  const handleGenerateOutline = async () => {
    if (!topic) {
      setError('Please enter a topic.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setOutline(null);
    setSections([]);
    setFooter('');
    try {
      const result = await generateOutline(topic, keywords);
      setOutline(result);
      setSections(result.outline.map(heading => ({
        heading,
        content: '',
        isGenerating: false
      })));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateSection = async (index: number) => {
    if (!outline) return;

    setSections(prev => prev.map((s, i) => i === index ? { ...s, isGenerating: true } : s));
    setError(null);

    try {
      const content = await generateSectionContent(topic, outline.title, sections[index].heading, outline.outline);
      setSections(prev => prev.map((s, i) => i === index ? { ...s, content, isGenerating: false } : s));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An unknown error occurred');
      setSections(prev => prev.map((s, i) => i === index ? { ...s, isGenerating: false } : s));
    }
  };

  const handleGenerateFooter = async () => {
      if (!outline) return;
      setIsGeneratingFooter(true);
      setError(null);
      try {
          const footerContent = await generateFooter(topic, outline.title);
          setFooter(footerContent);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'An unknown error occurred');
      } finally {
          setIsGeneratingFooter(false);
      }
  };
  
  const allSectionsDone = useMemo(() => sections.length > 0 && sections.every(s => s.content !== ''), [sections]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans">
      <header className="bg-slate-900/70 backdrop-blur-lg border-b border-slate-700 sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-3">
                <Wand2 className="w-8 h-8 text-sky-400" />
                <h1 className="text-2xl font-bold text-white">AI Article Editor V2</h1>
            </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Controls Column */}
          <div className="lg:col-span-1 space-y-8 sticky top-24">
            <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
              <h2 className="text-xl font-bold text-sky-400 mb-4 flex items-center">
                <FileText className="w-6 h-6 mr-2" />
                1. Article Details
              </h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="topic" className="block text-sm font-medium text-slate-400 mb-1">Topic</label>
                  <input
                    type="text"
                    id="topic"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-600 rounded-md px-3 py-2 focus:ring-sky-500 focus:border-sky-500"
                    placeholder="e.g., How to train a dragon"
                  />
                </div>
                <div>
                  <label htmlFor="keywords" className="block text-sm font-medium text-slate-400 mb-1">Keywords (comma-separated)</label>
                  <input
                    type="text"
                    id="keywords"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-600 rounded-md px-3 py-2 focus:ring-sky-500 focus:border-sky-500"
                    placeholder="e.g., dragon, training, flying"
                  />
                </div>
                <button
                  onClick={handleGenerateOutline}
                  disabled={isGeneratingAnything}
                  className="w-full flex items-center justify-center px-4 py-2 font-bold text-white bg-sky-600 rounded-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 focus:ring-offset-slate-900 disabled:bg-slate-600 disabled:cursor-not-allowed"
                >
                  {isLoading ? <LoadingSpinner /> : <><BotMessageSquare className="w-5 h-5 mr-2" /> Generate Outline</>}
                </button>
              </div>
            </div>

            {sections.length > 0 && <SectionGenerator sections={sections} onGenerateSection={handleGenerateSection} isGeneratingAnything={isGeneratingAnything} />}
            
            {allSectionsDone && (
                <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
                    <h2 className="text-xl font-bold text-sky-400 mb-4">3. Final Touches</h2>
                    <button
                        onClick={handleGenerateFooter}
                        disabled={isGeneratingAnything || footer !== ''}
                        className="w-full flex items-center justify-center px-4 py-2 font-bold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-slate-600 disabled:opacity-50"
                    >
                        {isGeneratingFooter ? <LoadingSpinner/> : <><Sparkles className="w-5 h-5 mr-2"/>Generate Footer</>}
                    </button>
                </div>
            )}
            
            {error && <div className="bg-red-900/50 text-red-300 border border-red-700 rounded-md p-4 text-sm">{error}</div>}
          </div>

          {/* Article Preview Column */}
          <div className="lg:col-span-2 bg-white text-slate-800 rounded-lg shadow-lg p-8 min-h-[calc(100vh-10rem)]">
            {outline ? (
              <article className="prose prose-slate lg:prose-lg max-w-none">
                <h1>{outline.title}</h1>
                <p className="lead">{outline.metaDescription}</p>
                <hr />
                {sections.map((section, index) => (
                  <section key={index}>
                    <div dangerouslySetInnerHTML={{ __html: section.content }} />
                    {section.isGenerating && (
                      <div className="flex items-center justify-center p-8 my-4 bg-slate-100 rounded-md">
                          <LoadingSpinner className="w-8 h-8 text-sky-600" />
                          <p className="ml-4 text-slate-600 font-medium">Generating content...</p>
                      </div>
                    )}
                  </section>
                ))}
                 {footer && <div dangerouslySetInnerHTML={{ __html: footer }} />}
                 {isGeneratingFooter && (
                      <div className="flex items-center justify-center p-8 my-4 bg-slate-100 rounded-md">
                          <LoadingSpinner className="w-8 h-8 text-indigo-600" />
                          <p className="ml-4 text-slate-600 font-medium">Generating footer...</p>
                      </div>
                    )}
              </article>
            ) : (
                <div className="flex flex-col items-center justify-center h-full text-center text-slate-500">
                    <Wand2 size={48} className="mb-4"/>
                    <h2 className="text-2xl font-bold text-slate-700">Your Article Will Appear Here</h2>
                    <p className="mt-2 max-w-md">
                        Enter a topic and some keywords, then click "Generate Outline" to begin creating your masterpiece.
                    </p>
                </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;


import React from 'react';
import { ArticleSection } from '../types';
import LoadingSpinner from './LoadingSpinner';
import { Bot, Sparkles } from 'lucide-react';

interface SectionGeneratorProps {
  sections: ArticleSection[];
  onGenerateSection: (index: number) => void;
  isGeneratingAnything: boolean;
}

const SectionGenerator: React.FC<SectionGeneratorProps> = ({ sections, onGenerateSection, isGeneratingAnything }) => {
  return (
    <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700 h-full flex flex-col">
      <h2 className="text-xl font-bold text-sky-400 mb-4 flex items-center">
        <Bot className="w-6 h-6 mr-2" />
        Article Outline
      </h2>
      <p className="text-slate-400 mb-6 text-sm">
        Click 'Generate' on each section to write the content. This avoids timeouts on long articles.
      </p>
      <div className="space-y-4 overflow-y-auto flex-grow">
        {sections.map((section, index) => (
          <div key={index} className="bg-slate-900 p-4 rounded-md border border-slate-700">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-slate-300">{index + 1}. {section.heading}</h3>
              <button
                onClick={() => onGenerateSection(index)}
                disabled={section.isGenerating || isGeneratingAnything || section.content !== ''}
                className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-sky-600 rounded-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 focus:ring-offset-slate-900 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
              >
                {section.isGenerating ? (
                  <LoadingSpinner className="w-4 h-4" />
                ) : section.content ? (
                  'Done'
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SectionGenerator;

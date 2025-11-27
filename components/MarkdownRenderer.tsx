import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  // Simple parser to handle basic markdown: **bold**, `code`, * list items, and headers
  const parseLine = (text: string) => {
    let parsed = text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
      .replace(/`(.*?)`/g, '<code class="bg-gray-800 text-green-400 px-1 py-0.5 rounded font-mono text-xs border border-gray-700">$1</code>');
    return parsed;
  };

  const lines = content.split('\n');

  return (
    <div className="space-y-3 text-gray-300 font-sans leading-7 text-sm md:text-base">
      {lines.map((line, index) => {
        const trimmed = line.trim();
        
        // Empty line
        if (!trimmed) return <div key={index} className="h-2" />;

        // Headers (### or **) at start for sections
        if (trimmed.startsWith('**') && trimmed.endsWith('**') && !trimmed.includes('Step')) {
             return <h4 key={index} className="text-white font-bold text-lg mt-4 mb-2" dangerouslySetInnerHTML={{ __html: parseLine(trimmed.replace(/\*\*/g, '')) }} />
        }
        
        // Bullet points
        if (trimmed.startsWith('* ')) {
          return (
            <div key={index} className="flex gap-3 pl-2">
              <span className="text-green-500 mt-2 text-[10px] flex-shrink-0">●</span>
              <span dangerouslySetInnerHTML={{ __html: parseLine(trimmed.substring(2)) }} />
            </div>
          );
        }

        // Standard Paragraph
        return <p key={index} dangerouslySetInnerHTML={{ __html: parseLine(trimmed) }} />;
      })}
    </div>
  );
};
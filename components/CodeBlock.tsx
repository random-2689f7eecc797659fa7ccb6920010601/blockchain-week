import React from 'react';

interface CodeBlockProps {
  code: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code }) => {
  // Simple regex-based syntax highlighting for Solidity
  const highlightCode = (source: string) => {
    return source.split('\n').map((line, i) => {
      // 0. Escape HTML characters FIRST to prevent rendering issues or injection
      // This fixes the bug where "<" or ">" in code (e.g. "if (a < b)") would break the HTML structure
      let content = line
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

      content = content
        // 1. Strings (Matches "text")
        .replace(/"(.*?)"/g, '<span class="text-green-400">"$1"</span>')
        
        // 2. Comments (Matches // text)
        .replace(/\/\/.*/g, '<span class="text-slate-500 italic">$&</span>')
        
        // 3. Keywords
        .replace(/\b(function|contract|modifier|mapping|address|uint|uint256|bool|string|public|private|internal|external|view|pure|payable|returns|require|if|else|for|while|return|emit|event|constructor)\b/g, '<span class="text-purple-400 font-bold">$&</span>')
        
        // 4. Global Vars & Special Keywords
        .replace(/\b(msg\.sender|msg\.value|block\.timestamp|address\(this\)|this\.balance)\b/g, '<span class="text-blue-400">$&</span>')
        
        // 5. Booleans
        .replace(/\b(true|false)\b/g, '<span class="text-orange-400">$&</span>');

      return (
        <div key={i} className="table-row hover:bg-white/5 transition-colors">
          <span className="table-cell text-right select-none text-slate-700 pr-4 w-8 border-r border-slate-800/50 mr-4 text-[10px] md:text-xs align-top pt-0.5 font-mono">
            {i + 1}
          </span>
          <span 
            className="table-cell pl-4 align-top whitespace-pre font-mono text-xs md:text-sm text-slate-300" 
            dangerouslySetInnerHTML={{ __html: content || ' ' }} 
          />
        </div>
      );
    });
  };

  return (
    <div className="bg-[#0D1117] rounded-lg overflow-hidden border border-gray-800 shadow-2xl my-4 group ring-1 ring-white/5">
      <div className="bg-[#161b22] px-4 py-2 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/80 shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 shadow-[0_0_8px_rgba(234,179,8,0.5)]"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/80 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
          <span className="ml-3 text-[10px] md:text-xs text-slate-400 font-mono font-bold tracking-tight opacity-70">VulnerableContract.sol</span>
        </div>
        <div className="text-[10px] text-slate-600 font-mono uppercase tracking-widest">Solidity 0.8.x</div>
      </div>
      <div className="p-4 overflow-x-auto custom-scrollbar">
        <div className="table w-full border-collapse">
          {highlightCode(code)}
        </div>
      </div>
    </div>
  );
};
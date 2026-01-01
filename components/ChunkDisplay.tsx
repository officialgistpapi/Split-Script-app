
import React, { useState } from 'react';
import { TextChunk } from '../types';

interface ChunkDisplayProps {
  chunks: TextChunk[];
  isProcessing: boolean;
}

export const ChunkDisplay: React.FC<ChunkDisplayProps> = ({ chunks, isProcessing }) => {
  if (isProcessing) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center text-gray-400 space-y-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
        <p className="text-sm font-medium">Analyzing script structure...</p>
      </div>
    );
  }

  if (chunks.length === 0) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-100 rounded-lg bg-gray-50/50">
        <svg className="w-16 h-16 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
        <p className="text-sm">Processed chunks will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 overflow-y-auto max-h-[700px] pr-2 custom-scrollbar">
      {chunks.map((chunk) => (
        <ChunkItem key={chunk.id} chunk={chunk} />
      ))}
    </div>
  );
};

const ChunkItem: React.FC<{ chunk: TextChunk }> = ({ chunk }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(chunk.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group bg-gray-50 border border-gray-200 rounded-lg p-4 transition-all hover:border-blue-300 hover:bg-white hover:shadow-md relative">
      <div className="flex justify-between items-start mb-2">
        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
          CHUNK {chunk.id}
        </span>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-gray-400 font-medium">
            {chunk.charCount} chars
          </span>
          <button 
            onClick={handleCopy}
            className={`p-1.5 rounded-md transition-all ${copied ? 'bg-green-100 text-green-600' : 'bg-white border border-gray-200 text-gray-500 hover:text-blue-600 hover:border-blue-200'}`}
          >
            {copied ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
            )}
          </button>
        </div>
      </div>
      <div className="mono text-sm text-gray-700 whitespace-pre-wrap leading-relaxed select-all">
        {chunk.content}
      </div>
    </div>
  );
};

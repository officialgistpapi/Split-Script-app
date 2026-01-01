
import React, { useState, useCallback, useMemo } from 'react';
import { Header } from './components/Header';
import { TextInput } from './components/TextInput';
import { ChunkDisplay } from './components/ChunkDisplay';
import { Controls } from './components/Controls';
import { TextChunk, SplitOptions } from './types';
import { splitTextAlgorithmic } from './utils/textUtils';
import { smartSplitWithGemini } from './services/geminiService';

const App: React.FC = () => {
  const [inputText, setInputText] = useState<string>('');
  const [limit, setLimit] = useState<number>(2000);
  const [chunks, setChunks] = useState<TextChunk[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [useSmartSplit, setUseSmartSplit] = useState<boolean>(false);

  const handleSplit = useCallback(async () => {
    if (!inputText.trim()) return;
    
    setIsProcessing(true);
    try {
      if (useSmartSplit) {
        const smartChunks = await smartSplitWithGemini(inputText, limit);
        setChunks(smartChunks);
      } else {
        const basicChunks = splitTextAlgorithmic(inputText, limit);
        setChunks(basicChunks);
      }
    } catch (error) {
      console.error("Splitting failed:", error);
      // Fallback to algorithmic if smart split fails
      const fallback = splitTextAlgorithmic(inputText, limit);
      setChunks(fallback);
    } finally {
      setIsProcessing(false);
    }
  }, [inputText, limit, useSmartSplit]);

  const stats = useMemo(() => ({
    totalChars: inputText.length,
    totalWords: inputText.split(/\s+/).filter(Boolean).length,
    chunkCount: chunks.length
  }), [inputText, chunks]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Input & Controls */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Input Script
              </h2>
              <TextInput value={inputText} onChange={setInputText} />
              
              <div className="mt-4 flex justify-between text-sm text-gray-500">
                <span>Characters: {stats.totalChars.toLocaleString()}</span>
                <span>Words: {stats.totalWords.toLocaleString()}</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold mb-4 text-gray-800 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                Configuration
              </h2>
              <Controls 
                limit={limit} 
                setLimit={setLimit} 
                onSplit={handleSplit} 
                isProcessing={isProcessing}
                useSmartSplit={useSmartSplit}
                setUseSmartSplit={setUseSmartSplit}
              />
            </div>
          </div>

          {/* Right Column: Chunks */}
          <div className="lg:col-span-7">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-[600px] flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  Generated Chunks
                  {chunks.length > 0 && (
                    <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                      {chunks.length} Total
                    </span>
                  )}
                </h2>
                {chunks.length > 0 && (
                  <button 
                    onClick={() => {
                      const allText = chunks.map(c => `[Chunk ${c.id}]\n${c.content}`).join('\n\n');
                      navigator.clipboard.writeText(allText);
                    }}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                    Copy All
                  </button>
                )}
              </div>
              
              <ChunkDisplay chunks={chunks} isProcessing={isProcessing} />
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-50 border-t border-gray-200 py-6">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          ScriptSplit Pro &copy; {new Date().getFullYear()} • Built with Gemini AI
        </div>
      </footer>
    </div>
  );
};

export default App;

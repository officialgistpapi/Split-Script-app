
import React from 'react';

interface ControlsProps {
  limit: number;
  setLimit: (val: number) => void;
  onSplit: () => void;
  isProcessing: boolean;
  useSmartSplit: boolean;
  setUseSmartSplit: (val: boolean) => void;
}

export const Controls: React.FC<ControlsProps> = ({ 
  limit, 
  setLimit, 
  onSplit, 
  isProcessing,
  useSmartSplit,
  setUseSmartSplit
}) => {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Max Characters Per Chunk: <span className="text-blue-600 font-bold">{limit}</span>
        </label>
        <input 
          type="range" 
          min="100" 
          max="5000" 
          step="100"
          value={limit}
          onChange={(e) => setLimit(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <div className="flex justify-between mt-1 text-[10px] text-gray-400 font-medium">
          <span>100</span>
          <span>1,000</span>
          <span>2,500</span>
          <span>5,000</span>
        </div>
      </div>

      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100">
        <div>
          <span className="block text-sm font-semibold text-blue-900">Smart Sentence Splitting</span>
          <span className="block text-[11px] text-blue-700">AI-optimized to keep context intact</span>
        </div>
        <button 
          onClick={() => setUseSmartSplit(!useSmartSplit)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${useSmartSplit ? 'bg-blue-600' : 'bg-gray-300'}`}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${useSmartSplit ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
      </div>

      <p className="text-[11px] text-gray-400 italic">
        * Sentences will be preserved unless they exceed the limit.
      </p>

      <button
        onClick={onSplit}
        disabled={isProcessing}
        className={`w-full py-3 px-4 rounded-lg font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 ${
          isProcessing 
            ? 'bg-blue-400 cursor-not-allowed' 
            : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-blue-200 hover:-translate-y-0.5 active:translate-y-0'
        }`}
      >
        {isProcessing ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Split Script Now
          </>
        )}
      </button>
    </div>
  );
};

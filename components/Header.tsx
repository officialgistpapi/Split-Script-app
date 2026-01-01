
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            ScriptSplit Pro
          </h1>
        </div>
        <div className="hidden sm:flex items-center gap-4">
          <a href="#" className="text-gray-600 hover:text-blue-600 text-sm font-medium transition-colors">Documentation</a>
          <a href="#" className="text-gray-600 hover:text-blue-600 text-sm font-medium transition-colors">Support</a>
        </div>
      </div>
    </header>
  );
};

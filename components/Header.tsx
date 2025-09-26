
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center">
         <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
        </svg>
        <h1 className="text-2xl font-bold tracking-tight">
          JurnalCheck <span className="text-sky-400">AI</span>
        </h1>
      </div>
    </header>
  );
};

export default Header;

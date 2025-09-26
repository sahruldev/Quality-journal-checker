import React, { useState, useRef } from 'react';
import { SearchIcon } from './icons/SearchIcon';
import { UploadIcon } from './icons/UploadIcon';

interface JournalInputFormProps {
  onSubmit: (query: string | File) => void;
  isLoading: boolean;
}

const JournalInputForm: React.FC<JournalInputFormProps> = ({ onSubmit, isLoading }) => {
  const [query, setQuery] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFile) {
      onSubmit(selectedFile);
    } else if (query.trim()) {
      onSubmit(query);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    if (file) {
      setQuery(''); // Clear text input when a file is chosen
    }
  };

  const handleUploadButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleTextInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    if (selectedFile) {
      setSelectedFile(null); // Clear file when user starts typing
      if (fileInputRef.current) fileInputRef.current.value = ''; // Reset file input
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={query}
          onChange={handleTextInputChange}
          placeholder="Masukkan nama jurnal, ISSN, link DOI, atau URL"
          className="flex-grow w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-shadow duration-200"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || (!query.trim() && !selectedFile)}
          className="flex items-center justify-center px-6 py-3 bg-sky-600 text-white font-semibold rounded-lg shadow-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Menganalisis...
            </>
          ) : (
            <>
              <SearchIcon className="h-5 w-5 mr-2" />
              Analisis Jurnal
            </>
          )}
        </button>
      </div>

      <div className="flex items-center text-sm">
        <div className="flex-grow border-t border-slate-200"></div>
        <span className="flex-shrink mx-4 text-slate-400">atau</span>
        <div className="flex-grow border-t border-slate-200"></div>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="application/pdf"
        disabled={isLoading}
      />

      <button
        type="button"
        onClick={handleUploadButtonClick}
        disabled={isLoading}
        className="w-full flex items-center justify-center px-6 py-3 bg-white text-slate-700 font-semibold rounded-lg border-2 border-dashed border-slate-300 hover:border-sky-500 hover:text-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:bg-slate-100 disabled:cursor-not-allowed disabled:border-slate-300 disabled:text-slate-400 transition-all duration-200"
      >
        <UploadIcon className="h-5 w-5 mr-2" />
        {selectedFile ? <span className="truncate max-w-xs sm:max-w-md">{selectedFile.name}</span> : 'Unggah File PDF'}
      </button>
    </form>
  );
};

export default JournalInputForm;

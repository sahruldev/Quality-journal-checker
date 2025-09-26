import React, { useState } from 'react';
import Header from './components/Header';
import JournalInputForm from './components/JournalInputForm';
import ResultDisplay from './components/ResultDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import { analyzeJournal } from './services/geminiService';
import type { JournalAnalysis } from './types';

const App: React.FC = () => {
  const [analysisResult, setAnalysisResult] = useState<JournalAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalysis = async (queryOrFile: string | File) => {
    if (typeof queryOrFile === 'string' && !queryOrFile.trim()) {
      setError("Silakan masukkan nama, ISSN jurnal, atau unggah file PDF.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const result = await analyzeJournal(queryOrFile);
      setAnalysisResult(result);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Terjadi kesalahan yang tidak diketahui.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-slate-200">
          <h2 className="text-2xl font-bold text-slate-700 mb-2">Cek Kualitas Jurnal Ilmiah</h2>
          <p className="text-slate-500 mb-6">Masukkan nama jurnal, ISSN, DOI, URL, atau unggah PDF untuk mendapatkan analisis kualitas, metrik, dan tips penulisan dari AI.</p>
          <JournalInputForm onSubmit={handleAnalysis} isLoading={isLoading} />
        </div>
        
        <div className="mt-8">
          {isLoading && <LoadingSpinner />}
          {error && <ErrorMessage message={error} />}
          {analysisResult && <ResultDisplay analysis={analysisResult} />}
          {!isLoading && !error && !analysisResult && (
             <div className="text-center py-10 px-6 bg-white rounded-2xl shadow-lg border border-slate-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                <h3 className="mt-2 text-lg font-semibold text-slate-700">Menunggu Analisis</h3>
                <p className="mt-1 text-sm text-slate-500">Hasil analisis jurnal Anda akan ditampilkan di sini.</p>
             </div>
          )}
        </div>
      </main>
       <footer className="text-center py-6 text-sm text-slate-400">
          <p>Powered by Google Gemini. © 2024 JurnalCheck AI.</p>
        </footer>
    </div>
  );
};

export default App;
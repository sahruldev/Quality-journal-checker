import React from 'react';
import type { JournalAnalysis } from '../types';
import { InfoIcon } from './icons/InfoIcon';
import { TargetIcon } from './icons/TargetIcon';
import { LightbulbIcon } from './icons/LightbulbIcon';

interface ResultDisplayProps {
  analysis: JournalAnalysis;
}

const getRankColor = (rank: string) => {
  const r = rank.toLowerCase();
  if (r.includes('q1') || r.includes('s1')) return 'bg-emerald-100 text-emerald-800 border-emerald-300';
  if (r.includes('q2') || r.includes('s2')) return 'bg-sky-100 text-sky-800 border-sky-300';
  if (r.includes('q3') || r.includes('s3')) return 'bg-amber-100 text-amber-800 border-amber-300';
  if (r.includes('q4') || r.includes('s4')) return 'bg-rose-100 text-rose-800 border-rose-300';
  return 'bg-slate-100 text-slate-800 border-slate-300';
};

const MetricCard: React.FC<{ title: string; value?: string; description: string }> = ({ title, value, description }) => {
    if (!value || value.toLowerCase() === 'n/a' || value.toLowerCase() === 'tidak ditemukan') return null;
    return (
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 relative group">
            <div className="flex items-center gap-1.5">
                <p className="text-sm text-slate-500">{title}</p>
                <div className="cursor-help">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400 group-hover:text-sky-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                 {/* Tooltip */}
                <div className="absolute bottom-full mb-2 w-64 p-3 bg-slate-800 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10 left-1/2 -translate-x-1/2">
                    {description}
                    <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-slate-800"></div>
                </div>
            </div>
            <p className="text-xl font-bold text-slate-800 mt-1">{value}</p>
        </div>
    );
};


const SectionCard: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-center mb-3">
            {icon}
            <h3 className="text-lg font-bold text-slate-700">{title}</h3>
        </div>
        <div className="text-slate-600 space-y-2 leading-relaxed whitespace-pre-wrap">{children}</div>
    </div>
);


const ResultDisplay: React.FC<ResultDisplayProps> = ({ analysis }) => {
  const metricsData = [
    { 
      title: "SJR", 
      value: analysis.metrics.sjr, 
      description: "SCImago Journal Rank: Mengukur pengaruh ilmiah jurnal berdasarkan jumlah kutipan dan prestise jurnal yang mengutip." 
    },
    { 
      title: "CiteScore", 
      value: analysis.metrics.citeScore, 
      description: "Menghitung rata-rata kutipan per dokumen yang diterbitkan dalam jurnal selama periode empat tahun (dihitung oleh Scopus)." 
    },
    { 
      title: "Impact Factor", 
      value: analysis.metrics.impactFactor, 
      description: "Mengukur frekuensi rata-rata artikel dalam jurnal dikutip dalam periode dua tahun (dihitung oleh JCR/Clarivate)." 
    },
    { 
      title: "H-Index", 
      value: analysis.metrics.hIndex, 
      description: "Menunjukkan bahwa jurnal telah menerbitkan 'h' artikel yang masing-masing telah dikutip setidaknya 'h' kali. Mengukur produktivitas dan dampak." 
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
        {/* Main Info */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-sky-800">{analysis.journalName}</h2>
                    <p className="text-slate-500">ISSN: {analysis.issn}</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold px-3 py-1 text-sm rounded-full bg-slate-100 text-slate-800 border border-slate-300">
                        {analysis.indexing}
                    </span>
                    <span className={`font-semibold px-3 py-1 text-sm rounded-full border ${getRankColor(analysis.rank)}`}>
                        {analysis.rank}
                    </span>
                </div>
            </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {metricsData.map(metric => (
              metric.value && metric.value.toLowerCase() !== 'n/a' && metric.value.toLowerCase() !== 'tidak ditemukan' 
              ? <MetricCard key={metric.title} title={metric.title} value={metric.value} description={metric.description} />
              : null
            ))}
        </div>

        {/* Detailed Sections */}
        <div className="space-y-6">
            <SectionCard title="Ringkasan & Reputasi" icon={<InfoIcon className="h-6 w-6 mr-3 text-sky-600" />}>
                <p>{analysis.reputationSummary}</p>
            </SectionCard>
            
            <SectionCard title="Estimasi Waktu Review" icon={<TargetIcon className="h-6 w-6 mr-3 text-emerald-600" />}>
                <p>{analysis.reviewTimeEstimation}</p>
            </SectionCard>

            <SectionCard title="Tips untuk Penulis" icon={<LightbulbIcon className="h-6 w-6 mr-3 text-amber-600" />}>
                <p>{analysis.tipsForAuthors}</p>
            </SectionCard>
        </div>
    </div>
  );
};

export default ResultDisplay;
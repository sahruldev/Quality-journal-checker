
export interface JournalAnalysis {
  journalName: string;
  issn: string;
  indexing: string;
  rank: string;
  metrics: {
    sjr?: string;
    citeScore?: string;
    impactFactor?: string;
    hIndex?: string;
  };
  reputationSummary: string;
  reviewTimeEstimation: string;
  tipsForAuthors: string;
}

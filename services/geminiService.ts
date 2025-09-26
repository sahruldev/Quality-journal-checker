import { GoogleGenAI, Type, Part } from "@google/genai";
import { JournalAnalysis } from '../types';

const journalSchema = {
  type: Type.OBJECT,
  properties: {
    journalName: { type: Type.STRING, description: "Nama lengkap jurnal" },
    issn: { type: Type.STRING, description: "Nomor ISSN atau e-ISSN jurnal. Tulis 'Tidak Ditemukan' jika tidak ada." },
    indexing: { type: Type.STRING, description: "Indeksasi utama (e.g., Scopus, Sinta, atau keduanya)" },
    rank: { type: Type.STRING, description: "Peringkat jurnal (e.g., Q1, Q2, S1, S2). Tulis 'Tidak Terindeks' jika tidak ada peringkat." },
    metrics: {
      type: Type.OBJECT,
      properties: {
        sjr: { type: Type.STRING, description: "SCImago Journal Rank (SJR). Tulis 'N/A' jika tidak berlaku." },
        citeScore: { type: Type.STRING, description: "CiteScore dari Scopus. Tulis 'N/A' jika tidak berlaku." },
        impactFactor: { type: Type.STRING, description: "Impact Factor (JCR). Tulis 'N/A' jika tidak berlaku." },
        hIndex: { type: Type.STRING, description: "H-Index jurnal. Tulis 'N/A' jika tidak berlaku." }
      }
    },
    reputationSummary: { type: Type.STRING, description: "Ringkasan reputasi, bidang fokus, dan penerbit jurnal. Jelaskan secara singkat." },
    reviewTimeEstimation: { type: Type.STRING, description: "Estimasi waktu rata-rata dari submit hingga publikasi. Berikan rentang waktu (misal: 3-6 bulan)." },
    tipsForAuthors: { type: Type.STRING, description: "Saran dan tips praktis untuk penulis yang ingin submit ke jurnal ini. Berikan dalam bentuk poin-poin." }
  },
  required: ["journalName", "issn", "indexing", "rank", "reputationSummary", "reviewTimeEstimation", "tipsForAuthors", "metrics"]
};

// Helper function to convert File to a GoogleGenerativeAI.Part
async function fileToGenerativePart(file: File): Promise<Part> {
    const base64EncodedDataPromise = new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            if (typeof reader.result === 'string') {
                // Remove the data URL prefix
                resolve(reader.result.split(',')[1]);
            } else {
                reject(new Error("Failed to read file as data URL."));
            }
        };
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });

    return {
        inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
    };
}


export const analyzeJournal = async (journalQuery: string | File): Promise<JournalAnalysis> => {
    if (!process.env.API_KEY) {
        throw new Error("API key not found. Please set the API_KEY environment variable.");
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    let contents: string | { parts: Part[] };

    if (typeof journalQuery === 'string') {
        contents = `Analisis kualitas jurnal ilmiah berdasarkan informasi berikut: "${journalQuery}". Input ini bisa berupa nama jurnal, ISSN, link DOI, atau URL halaman utama jurnal. Fokus pada data dari Scopus dan Sinta. Jika informasi tidak ditemukan, berikan jawaban 'Tidak Ditemukan' atau 'N/A' pada kolom yang sesuai.`;
    } else {
        const filePart = await fileToGenerativePart(journalQuery);
        contents = {
            parts: [
                { text: "Analisis kualitas jurnal ilmiah berdasarkan file PDF terlampir. Identifikasi nama jurnal, ISSN, dan metrik relevan lainnya dari dokumen tersebut. Fokus pada data dari Scopus dan Sinta. Jika informasi tidak ditemukan, berikan jawaban 'Tidak Ditemukan' atau 'N/A' pada kolom yang sesuai." },
                filePart
            ]
        };
    }

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: contents,
            config: {
                responseMimeType: "application/json",
                responseSchema: journalSchema,
                temperature: 0.2,
            },
        });
        
        const jsonText = response.text.trim();
        const parsedData = JSON.parse(jsonText);

        return parsedData as JournalAnalysis;

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to get analysis from AI. The journal might not be found or there was an API issue.");
    }
};
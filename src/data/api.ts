import type { Lesson } from './types';
import { setQuotes } from '../utils/quotes';

const EN_URL = "/data/enVocab_fixed.json";
const ES_URL = "/data/esVocab_fixed.json";
const QUOTES_URL = "/data/quotes.txt";

const CHUNK_SIZE = 20;

export const fetchLessons = async (): Promise<Lesson[]> => {
  try {
    const [enRes, esRes, quotesRes] = await Promise.all([
      fetch(EN_URL),
      fetch(ES_URL),
      fetch(QUOTES_URL)
    ]);

    if (!enRes.ok || !esRes.ok || !quotesRes.ok) {
        throw new Error(`Failed to load data: EN:${enRes.status}, ES:${esRes.status}, Q:${quotesRes.status}`);
    }

    const enQuestions: any[] = await enRes.json();
    const esQuestions: any[] = await esRes.json();
    const quotesText: string = await quotesRes.text();

    const quoteMatches = quotesText.match(/"([^"]+)"/g);
    if (quoteMatches) {
        const extractedQuotes = quoteMatches.map(q => q.replace(/"/g, ''));
        setQuotes(extractedQuotes);
    }

    const processQuestions = (questions: any[]) => questions.map(q => ({
        ...q,
        type: q.type === 'translate' ? 'tap-translate' : q.type,
        distractors: q.distractors || ['word1', 'word2', 'word3']
    }));

    const validEn = processQuestions(enQuestions);
    const validEs = processQuestions(esQuestions).filter(q => !q.correctAnswer.includes("MYMEMORY WARNING"));

    const lessons: Lesson[] = [];

    // Chunk English
    for (let i = 0; i < validEn.length; i += CHUNK_SIZE) {
        const chunk = validEn.slice(i, i + CHUNK_SIZE);
        lessons.push({
            id: `en-${i / CHUNK_SIZE + 1}`,
            title: `Angielski - Lekcja ${i / CHUNK_SIZE + 1}`,
            category: 'English',
            questions: chunk
        });
    }

    // Chunk Spanish
    for (let i = 0; i < validEs.length; i += CHUNK_SIZE) {
        const chunk = validEs.slice(i, i + CHUNK_SIZE);
        lessons.push({
            id: `es-${i / CHUNK_SIZE + 1}`,
            title: `Hiszpański - Lekcja ${i / CHUNK_SIZE + 1}`,
            category: 'Spanish',
            questions: chunk
        });
    }

    return lessons;
  } catch (error) {
    console.error("Error fetching lessons:", error);
    throw error;
  }
};

import type { Lesson } from './types';
import { setQuotes } from '../utils/quotes';

const EN_URL = "https://docs.google.com/uc?export=download&id=1mRhaGP3rvRfb0sNVUy9haRIDDoSnYANz";
const ES_URL = "https://docs.google.com/uc?export=download&id=1Y4Sn1WON8d8uYhNW3K8kghPUh3CHZ9bK";
const QUOTES_URL = "https://docs.google.com/uc?export=download&id=1SD9BOR6FuLdR9dXSweH7lXC80OoNKAd9";

export const fetchLessons = async (): Promise<Lesson[]> => {
  try {
    const [enRes, esRes, quotesRes] = await Promise.all([
      fetch(EN_URL),
      fetch(ES_URL),
      fetch(QUOTES_URL)
    ]);

    const enQuestions: any[] = await enRes.json();
    const esQuestions: any[] = await esRes.json();
    const quotesText: string = await quotesRes.text();

    const quoteMatches = quotesText.match(/"([^"]+)"/g);
    if (quoteMatches) {
        const extractedQuotes = quoteMatches.map(q => q.replace(/"/g, ''));
        setQuotes(extractedQuotes);
    }

    const enLesson: Lesson = {
      id: 'en-vocab',
      title: 'English Vocabulary',
      category: 'English',
      questions: enQuestions.map(q => ({
        ...q,
        type: q.type === 'translate' ? 'tap-translate' : q.type,
        distractors: q.distractors || ['word1', 'word2', 'word3']
      }))
    };

    const esLesson: Lesson = {
      id: 'es-vocab',
      title: 'Spanish Vocabulary',
      category: 'Spanish',
      questions: esQuestions.map(q => ({
        ...q,
        type: q.type === 'translate' ? 'tap-translate' : q.type,
        distractors: q.distractors || ['palabra1', 'palabra2', 'palabra3']
      })).filter(q => !q.correctAnswer.includes("MYMEMORY WARNING"))
    };

    return [enLesson, esLesson];
  } catch (error) {
    console.error("Error fetching lessons:", error);
    throw error;
  }
};

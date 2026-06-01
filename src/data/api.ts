import type { Lesson, Question } from './types';
import { setQuotes } from '../utils/quotes';

// Helper to wrap URLs with a CORS proxy
const withProxy = (url: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;

const EN_URL = withProxy("https://drive.google.com/uc?export=download&id=1mRhaGP3rvRfb0sNVUy9haRIDDoSnYANz");
const ES_URL = withProxy("https://drive.google.com/uc?export=download&id=1Y4Sn1WON8d8uYhNW3K8kghPUh3CHZ9bK");
const QUOTES_URL = withProxy("https://drive.google.com/uc?export=download&id=1SD9BOR6FuLdR9dXSweH7lXC80OoNKAd9");

const CHUNK_SIZE = 20;

const getRandomItems = <T>(arr: T[], count: number): T[] => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const generateTask = (q: any, allQuestions: any[], lang: string): Question => {
  const rand = Math.random();

  // 15% Match Pairs
  if (rand < 0.15 && allQuestions.length >= 5) {
      const selected = getRandomItems(allQuestions, 5);
      return {
          id: `match-${q.id}`,
          type: 'match-pairs',
          prompt: 'Połącz pary',
          instruction: 'Połącz polskie i zagraniczne zwroty',
          pairs: selected.map(item => ({
              id: item.id,
              native: (item.prompt || '').replace(/[“”]/g, '').trim(),
              target: item.correctAnswer || ''
          })),
          audioText: 'Match the pairs',
          lang: lang === 'English' ? 'en-US' : 'es-ES'
      };
  }

  // 35% Tap Translate
  if (rand < 0.50) {
    const distractors = getRandomItems(
      allQuestions
        .filter(item => item.id !== q.id)
        .flatMap(item => (item.correctAnswer || '').split(' '))
        .filter(word => word.length > 3),
      4
    );

    return {
      ...q,
      type: 'tap-translate',
      instruction: lang === 'English' ? 'Ułóż zdanie po angielsku' : 'Ułóż zdanie po hiszpańsku',
      distractors,
      audioText: q.correctAnswer,
      lang: lang === 'English' ? 'en-US' : 'es-ES'
    };
  }

  // 25% Multiple Choice
  if (rand < 0.75) {
    const otherOptions = getRandomItems(
      allQuestions.filter(item => item.id !== q.id).map(item => item.correctAnswer || '---'),
      3
    );

    const options = [
      { id: 'correct', text: q.correctAnswer || '', correct: true },
      ...otherOptions.map((text, i) => ({ id: `opt-${i}`, text, correct: false }))
    ].sort(() => Math.random() - 0.5);

    return {
      ...q,
      type: 'multiple-choice',
      instruction: 'Wybierz poprawne tłumaczenie',
      options,
      audioText: q.correctAnswer,
      lang: lang === 'English' ? 'en-US' : 'es-ES'
    };
  }

  // 25% Gap Fill
  const words = (q.correctAnswer || '').split(' ');
  if (words.length > 3) {
    const targetIndex = Math.floor(Math.random() * words.length);
    const targetWord = words[targetIndex];
    const sentence = words.map((w: string, i: number) => i === targetIndex ? '___' : w).join(' ');

    const distractors = getRandomItems(
      allQuestions
        .filter(item => item.id !== q.id)
        .flatMap(item => (item.correctAnswer || '').split(' '))
        .filter(word => word.length > 3 && word !== targetWord),
      3
    );

    return {
      ...q,
      type: 'gap-fill',
      instruction: 'Uzupełnij lukę',
      sentence,
      correctAnswer: targetWord,
      distractors,
      audioText: q.correctAnswer,
      lang: lang === 'English' ? 'en-US' : 'es-ES'
    };
  }

  // Fallback to tap-translate
  return {
    ...q,
    type: 'tap-translate',
    distractors: ['the', 'is', 'a', 'to'],
    audioText: q.correctAnswer || '',
    lang: lang === 'English' ? 'en-US' : 'es-ES'
  };
};

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

    const enRaw: any[] = await enRes.json();
    const esRaw: any[] = await esRes.json();
    const quotesText: string = await quotesRes.text();

    const quoteMatches = quotesText.match(/"([^"]+)"/g);
    if (quoteMatches) {
        const extractedQuotes = quoteMatches.map(q => q.replace(/"/g, ''));
        setQuotes(extractedQuotes);
    }

    const lessons: Lesson[] = [];

    const categorizeByHeuristic = (_id: string, index: number) => {
        if (index < 50) return 'Codzienne';
        if (index < 100) return 'Biznesowe';
        if (index < 150) return 'Slang';
        return 'Ogólne';
    };

    // Process English
    const validEnRaw = enRaw.filter(q =>
        q.correctAnswer &&
        !q.correctAnswer.includes("MYMEMORY WARNING") &&
        q.prompt &&
        !q.prompt.includes("MYMEMORY WARNING")
    );
    const processedEn = validEnRaw.map(q => generateTask(q, validEnRaw, 'English'));
    for (let i = 0; i < processedEn.length; i += CHUNK_SIZE) {
        const chunk = processedEn.slice(i, i + CHUNK_SIZE);
        const category = categorizeByHeuristic('en', i);
        lessons.push({
            id: `en-${i / CHUNK_SIZE + 1}`,
            title: `Angielski - Lekcja ${i / CHUNK_SIZE + 1}`,
            category: category as any,
            questions: chunk
        });
    }

    // Process Spanish
    const validEsRaw = esRaw.filter(q =>
        q.correctAnswer &&
        !q.correctAnswer.includes("MYMEMORY WARNING") &&
        q.prompt &&
        !q.prompt.includes("MYMEMORY WARNING")
    );
    const processedEs = validEsRaw.map(q => generateTask(q, validEsRaw, 'Spanish'));
    for (let i = 0; i < processedEs.length; i += CHUNK_SIZE) {
        const chunk = processedEs.slice(i, i + CHUNK_SIZE);
        const category = categorizeByHeuristic('es', i);
        lessons.push({
            id: `es-${i / CHUNK_SIZE + 1}`,
            title: `Hiszpański - Lekcja ${i / CHUNK_SIZE + 1}`,
            category: category as any,
            questions: chunk
        });
    }

    return lessons;
  } catch (error) {
    console.error("Error fetching lessons:", error);
    throw error;
  }
};

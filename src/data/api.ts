import type { Lesson, Question } from './types';
import { setQuotes } from '../utils/quotes';

const EN_URL = "/data/enVocab_fixed.json";
const ES_URL = "/data/esVocab_fixed.json";
const QUOTES_URL = "/data/quotes.txt";

const CHUNK_SIZE = 20;

const getRandomItems = <T>(arr: T[], count: number): T[] => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const generateTask = (q: any, allQuestions: any[], lang: string): Question => {
  const rand = Math.random();

  // 40% Tap Translate
  if (rand < 0.4) {
    const distractors = getRandomItems(
      allQuestions
        .filter(item => item.id !== q.id)
        .flatMap(item => item.correctAnswer.split(' '))
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

  // 30% Multiple Choice
  if (rand < 0.7) {
    const otherOptions = getRandomItems(
      allQuestions.filter(item => item.id !== q.id).map(item => item.correctAnswer),
      3
    );

    const options = [
      { id: 'correct', text: q.correctAnswer, correct: true },
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

  // 30% Gap Fill
  const words = q.correctAnswer.split(' ');
  if (words.length > 3) {
    const targetIndex = Math.floor(Math.random() * words.length);
    const targetWord = words[targetIndex];
    const sentence = words.map((w: string, i: number) => i === targetIndex ? '___' : w).join(' ');

    const distractors = getRandomItems(
      allQuestions
        .filter(item => item.id !== q.id)
        .flatMap(item => item.correctAnswer.split(' '))
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

  // Fallback to tap-translate if sentence is too short for gap-fill
  return {
    ...q,
    type: 'tap-translate',
    distractors: ['the', 'is', 'a', 'to'],
    audioText: q.correctAnswer,
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

    // Process English
    const processedEn = enRaw.map(q => generateTask(q, enRaw, 'English'));
    for (let i = 0; i < processedEn.length; i += CHUNK_SIZE) {
        const chunk = processedEn.slice(i, i + CHUNK_SIZE);
        lessons.push({
            id: `en-${i / CHUNK_SIZE + 1}`,
            title: `Angielski - Lekcja ${i / CHUNK_SIZE + 1}`,
            category: 'English',
            questions: chunk
        });
    }

    // Process Spanish
    const validEsRaw = esRaw.filter(q => !q.correctAnswer.includes("MYMEMORY WARNING"));
    const processedEs = validEsRaw.map(q => generateTask(q, validEsRaw, 'Spanish'));
    for (let i = 0; i < processedEs.length; i += CHUNK_SIZE) {
        const chunk = processedEs.slice(i, i + CHUNK_SIZE);
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

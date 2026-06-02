import type { Lesson, Question } from './types';
import { setQuotes } from '../utils/quotes';

const CHUNK_SIZE = 20;

/**
 * GitHub Gist RAW URLs.
 * UWAGA: Użytkownik musi podmienić te linki na swoje linki RAW z Gista.
 * Jeśli zostawisz placeholder (gist-id), aplikacja użyje plików lokalnych z /public/data/.
 */
const EN_URL = "https://gist.githubusercontent.com/user/gist-id-en/raw/en.json";
const ES_URL = "https://gist.githubusercontent.com/user/gist-id-es/raw/es.json";
const QUOTES_URL = "https://gist.githubusercontent.com/user/gist-id-quotes/raw/quotes.txt";


const shuffle = <T>(arr: T[]): T[] => [...arr].sort(() => 0.5 - Math.random());

const getRandomItems = <T>(arr: T[], count: number): T[] => {
  return shuffle(arr).slice(0, count);
};

const generateTask = (q: any, allQuestions: any[], lang: string): Question => {
  const rand = Math.random();
  const isSpanishTrack = lang === 'Spanish';
  const langCode = isSpanishTrack ? 'es-ES' : 'en-US';

  // For Spanish, we learn from English, so swap prompt and answer if needed
  // and handle Polish labels differently
  const nativeText = isSpanishTrack ? q.prompt : (q.prompt || '').replace(/[“”]/g, '').trim();
  const targetText = q.correctAnswer || '';
  const nativeLang = isSpanishTrack ? 'en-US' : 'pl-PL';

  // 15% Match Pairs
  if (rand < 0.15 && allQuestions.length >= 5) {
      const selected = getRandomItems(allQuestions, 5);
      return {
          id: `match-${q.id}`,
          type: 'match-pairs',
          prompt: isSpanishTrack ? 'Match pairs' : 'Połącz pary',
          instruction: isSpanishTrack ? 'Match English and Spanish phrases' : 'Połącz polskie i zagraniczne zwroty',
          pairs: shuffle(selected.map(item => ({
              id: item.id,
              native: isSpanishTrack ? item.prompt : (item.prompt || '').replace(/[“”]/g, '').trim(),
              target: item.correctAnswer || ''
          }))),
          audioText: 'Match the pairs',
          lang: langCode,
          targetLang: langCode,
          nativeLang: nativeLang
      };
  }

  // 15% Listen Match
  if (rand < 0.30) {
    const distractors = getRandomItems(
        allQuestions.filter(item => item.id !== q.id).map(item => item.correctAnswer || '---'),
        3
    );
    const options = shuffle([
        { id: 'correct', text: targetText, correct: true },
        ...distractors.map((text, i) => ({ id: `opt-${i}`, text, correct: false }))
    ]);

    return {
        ...q,
        type: 'listen-match',
        instruction: isSpanishTrack ? 'Listen and choose correct answer' : 'Odsłuchaj i wybierz poprawną odpowiedź',
        options,
        audioText: targetText,
        lang: langCode,
        nativeLang: nativeLang
    };
  }

  // 25% Multiple Choice
  if (rand < 0.55) {
    const distractors = getRandomItems(
      allQuestions.filter(item => item.id !== q.id).map(item => item.correctAnswer || '---'),
      3
    );

    const options = shuffle([
      { id: 'correct', text: targetText, correct: true },
      ...distractors.map((text, i) => ({ id: `opt-${i}`, text, correct: false }))
    ]);

    return {
      ...q,
      type: 'multiple-choice',
      prompt: nativeText,
      instruction: isSpanishTrack ? 'Choose correct translation' : 'Wybierz poprawne tłumaczenie',
      options,
      audioText: targetText,
      lang: langCode,
      nativeLang: nativeLang
    };
  }

  // 25% Tap Translate
  if (rand < 0.80) {
    const words = targetText.split(' ');
    const distractors = getRandomItems(
        allQuestions
          .filter(item => item.id !== q.id)
          .flatMap(item => (item.correctAnswer || '').split(' '))
          .filter(word => word.length > 3 && !words.includes(word)),
        4
      ).map(w => w.replace(/[.,!?]/g, ''));

      return {
        ...q,
        type: 'tap-translate',
        prompt: nativeText,
        instruction: isSpanishTrack ? 'Translate to Spanish' : (lang === 'English' ? 'Ułóż zdanie po angielsku' : 'Ułóż zdanie po hiszpańsku'),
        distractors,
        audioText: targetText,
        lang: langCode,
        nativeLang: nativeLang
      };
  }

  // 20% Classic Translate
  return {
    ...q,
    type: 'translate',
    prompt: nativeText,
    instruction: isSpanishTrack ? 'Translate to Spanish' : ('Przetłumacz na ' + (lang === 'English' ? 'angielski' : 'hiszpański')),
    audioText: targetText,
    lang: langCode,
    nativeLang: nativeLang
  };
};

export const fetchLessons = async (): Promise<Lesson[]> => {
  try {
    // Attempt to fetch from Gist, fallback to local /data/ during development/setup
    const fetchWithFallback = async (url: string, localPath: string) => {
        // Skip if URL is just a placeholder to avoid 404 console errors
        if (url.includes('gist-id')) {
            return fetch(localPath);
        }

        try {
            const res = await fetch(url);
            if (res.ok) return res;
            console.warn(`Gist fetch failed for ${url}, falling back to local.`);
            return fetch(localPath);
        } catch {
            return fetch(localPath);
        }
    };

    const [enRes, esRes, quotesRes] = await Promise.all([
      fetchWithFallback(EN_URL, "/data/en.json"),
      fetchWithFallback(ES_URL, "/data/es.json"),
      fetchWithFallback(QUOTES_URL, "/data/quotes.txt")
    ]);

    if (!enRes.ok || !esRes.ok || !quotesRes.ok) {
        throw new Error(`Failed to load data. Ensure files exist in /public/data/ or Gist URLs are correct.`);
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

    const getCategory = (lang: string, index: number) => {
        const prefix = lang === 'English' ? 'Angielski' : 'Hiszpański';
        const multiplier = lang === 'English' ? 1 : 4; // User said Spanish has 4x more lines

        if (index < 50 * multiplier) return `${prefix} - Codzienne`;
        if (index < 100 * multiplier) return `${prefix} - Biznesowe`;
        if (index < 150 * multiplier) return `${prefix} - Slang`;
        return `${prefix} - Ogólne`;
    };

    // Process English
    const validEnRaw = enRaw.filter(q =>
        q.correctAnswer && !q.correctAnswer.includes("MYMEMORY WARNING") &&
        q.prompt && !q.prompt.includes("MYMEMORY WARNING")
    );
    const processedEn = validEnRaw.map(q => generateTask(q, validEnRaw, 'English'));
    for (let i = 0; i < processedEn.length; i += CHUNK_SIZE) {
        const chunk = shuffle(processedEn.slice(i, i + CHUNK_SIZE));
        const category = getCategory('English', i);
        lessons.push({
            id: `en-${i / CHUNK_SIZE + 1}`,
            title: `Angielski - Lekcja ${i / CHUNK_SIZE + 1}`,
            category: category as any,
            questions: chunk
        });
    }

    // Process Spanish
    const validEsRaw = esRaw.filter(q =>
        q.correctAnswer && !q.correctAnswer.includes("MYMEMORY WARNING") &&
        q.prompt && !q.prompt.includes("MYMEMORY WARNING")
    );

    const processedEs = esRaw.map(q => {
        const hasError = (q.correctAnswer && q.correctAnswer.includes("MYMEMORY WARNING")) ||
                         (q.prompt && q.prompt.includes("MYMEMORY WARNING"));

        if (hasError) {
            return {
                ...q,
                type: 'translate',
                prompt: q.prompt || '---',
                instruction: 'W przygotowaniu',
                correctAnswer: '---',
                audioText: '',
                lang: 'es-ES',
                nativeLang: 'en-US',
                isPlaceholder: true
            } as Question;
        }
        return generateTask(q, validEsRaw, 'Spanish');
    });

    for (let i = 0; i < processedEs.length; i += CHUNK_SIZE) {
        const chunk = shuffle(processedEs.slice(i, i + CHUNK_SIZE));
        const category = getCategory('Spanish', i);
        lessons.push({
            id: `es-${i / CHUNK_SIZE + 1}`,
            title: `Hiszpański - Lekcja ${i / CHUNK_SIZE + 1}`,
            category: category as any,
            questions: chunk
        });
    }

    return lessons;
  } catch (error) {
    console.error("Error in fetchLessons:", error);
    throw error;
  }
};

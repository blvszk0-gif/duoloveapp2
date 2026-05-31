export type QuestionType = 'tap-translate' | 'multiple-choice' | 'gap-fill' | 'match-pairs';

export interface Question {
  id: string;
  type: QuestionType;
  prompt: string;
  correctAnswer?: string;
  distractors?: string[];
  options?: { id: string; text: string; correct: boolean }[];
  sentence?: string; // For gap-fill, e.g. "I want to eat ___."
  pairs?: { id: string; native: string; target: string }[];
  audioText?: string;
  lang?: string;
  hint?: string;
}

export type Category = 'Biznesowe' | 'Slang' | 'Codzienne' | 'General';

export interface Lesson {
  id: string;
  title: string;
  category: Category;
  questions: Question[];
}

export const LESSONS: Lesson[] = [
  {
    id: 'biz-1',
    title: 'Spotkanie biznesowe',
    category: 'Biznesowe',
    questions: [
      {
        id: 'b1q1',
        type: 'multiple-choice',
        prompt: 'Jak powiesz "Przejdźmy do sedna" po angielsku?',
        options: [
          { id: '1', text: 'Let\'s get down to business', correct: true },
          { id: '2', text: 'Let\'s go to the middle', correct: false },
          { id: '3', text: 'Let\'s jump into the core', correct: false },
          { id: '4', text: 'Let\'s move to the point', correct: false },
        ],
        audioText: 'Let\'s get down to business',
        lang: 'en-US',
        hint: 'Idiom związany z robieniem biznesu.'
      },
      {
        id: 'b1q2',
        type: 'tap-translate',
        prompt: 'Przetłumacz: "Chciałbym omówić harmonogram."',
        correctAnswer: 'I would like to discuss the schedule',
        distractors: ['want', 'talk', 'time'],
        audioText: 'I would like to discuss the schedule',
        lang: 'en-US',
        hint: 'Użyj formy grzecznościowej "I would like to".'
      }
    ]
  },
  {
    id: 'biz-2',
    title: 'Negocjacje',
    category: 'Biznesowe',
    questions: [
      {
        id: 'b2q1',
        type: 'gap-fill',
        prompt: 'Uzupełnij lukę',
        sentence: 'We need to reach a ___ on this price.',
        correctAnswer: 'compromise',
        distractors: ['problem', 'meeting', 'sugar'],
        audioText: 'We need to reach a compromise on this price.',
        lang: 'en-US',
        hint: 'Ugoda, wypracowanie wspólnego stanowiska.'
      }
    ]
  },
  {
    id: 'slang-1',
    title: 'Młodzieżowy angielski',
    category: 'Slang',
    questions: [
      {
        id: 's1q1',
        type: 'multiple-choice',
        prompt: 'Co oznacza "No cap"?',
        options: [
          { id: '1', text: 'Bez kłamstwa / Naprawdę', correct: true },
          { id: '2', text: 'Bez czapki', correct: false },
          { id: '3', text: 'Nie ma szans', correct: false },
          { id: '4', text: 'To jest słabe', correct: false },
        ],
        hint: 'Często używane, by podkreślić, że mówi się prawdę.'
      },
      {
        id: 's1q2',
        type: 'gap-fill',
        prompt: 'Uzupełnij lukę',
        sentence: 'That movie was so ___, I loved it!',
        correctAnswer: 'fire',
        distractors: ['water', 'cold', 'slow'],
        audioText: 'That movie was so fire, I loved it!',
        lang: 'en-US',
        hint: 'Coś gorącego, bardzo dobrego.'
      }
    ]
  },
  {
    id: 'slang-2',
    title: 'Internetowy slang',
    category: 'Slang',
    questions: [
      {
        id: 's2q1',
        type: 'tap-translate',
        prompt: 'Przetłumacz: "On jest prawdziwym GOAT."',
        correctAnswer: 'He is the real GOAT',
        distractors: ['goat', 'animal', 'greatest'],
        audioText: 'He is the real GOAT',
        lang: 'en-US',
        hint: 'Skrót od Greatest Of All Time.'
      }
    ]
  },
  {
    id: 'daily-1',
    title: 'W kawiarni',
    category: 'Codzienne',
    questions: [
      {
        id: 'd1q1',
        type: 'match-pairs',
        prompt: 'Połącz pary',
        pairs: [
          { id: 'p1', native: 'Kawa', target: 'Coffee' },
          { id: 'p2', native: 'Herbata', target: 'Tea' },
          { id: 'p3', native: 'Cukier', target: 'Sugar' },
          { id: 'p4', native: 'Mleko', target: 'Milk' },
        ]
      }
    ]
  },
  {
    id: 'daily-2',
    title: 'W sklepie',
    category: 'Codzienne',
    questions: [
      {
        id: 'd2q1',
        type: 'multiple-choice',
        prompt: 'Jak zapytasz o cenę?',
        options: [
          { id: '1', text: 'How much is it?', correct: true },
          { id: '2', text: 'What is the number?', correct: false },
          { id: '3', text: 'How many cost?', correct: false },
          { id: '4', text: 'Is it expensive?', correct: false },
        ],
        hint: 'Pytanie o ilość/cenę.'
      }
    ]
  }
];

// For backward compatibility
export const POLISH_ENGLISH_LESSON = LESSONS[0];
export const ENGLISH_SPANISH_LESSON = LESSONS[4];

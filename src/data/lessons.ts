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
}

export interface Lesson {
  id: string;
  title: string;
  questions: Question[];
}

export const POLISH_ENGLISH_LESSON: Lesson = {
  id: 'pl-en-c1',
  title: 'Polish to English (C1)',
  questions: [
    {
      id: 'q1',
      type: 'multiple-choice',
      prompt: 'What is the English equivalent of "Niewątpliwie"?',
      options: [
        { id: '1', text: 'Undoubtedly', correct: true },
        { id: '2', text: 'Dubiously', correct: false },
        { id: '3', text: 'Doubtfully', correct: false },
        { id: '4', text: 'Unbelievably', correct: false },
      ],
      audioText: 'Undoubtedly',
      lang: 'en-US'
    },
    {
      id: 'q2',
      type: 'tap-translate',
      prompt: 'Translate to English: "On jest bardzo ambitny."',
      correctAnswer: 'He is very ambitious',
      distractors: ['she', 'was', 'lazy'],
      audioText: 'He is very ambitious',
      lang: 'en-US'
    },
    {
      id: 'q3',
      type: 'gap-fill',
      prompt: 'Fill in the blank',
      sentence: 'It is highly ___ that we will succeed.',
      correctAnswer: 'probable',
      distractors: ['probably', 'problem', 'possibility'],
      audioText: 'It is highly probable that we will succeed.',
      lang: 'en-US'
    },
    {
      id: 'q4',
      type: 'match-pairs',
      prompt: 'Match the pairs',
      pairs: [
        { id: 'p1', native: 'Chleb', target: 'Bread' },
        { id: 'p2', native: 'Woda', target: 'Water' },
        { id: 'p3', native: 'Kot', target: 'Cat' },
        { id: 'p4', native: 'Pies', target: 'Dog' },
        { id: 'p5', native: 'Dom', target: 'House' },
      ]
    }
  ]
};

export const ENGLISH_SPANISH_LESSON: Lesson = {
  id: 'en-es-a1',
  title: 'English to Spanish (A1)',
  questions: [
    {
      id: 's1',
      type: 'multiple-choice',
      prompt: 'How do you say "Hello" in Spanish?',
      options: [
        { id: '1', text: 'Hola', correct: true },
        { id: '2', text: 'Adiós', correct: false },
        { id: '3', text: 'Gracias', correct: false },
        { id: '4', text: 'Por favor', correct: false },
      ],
      audioText: 'Hola',
      lang: 'es-ES'
    },
    {
      id: 's2',
      type: 'tap-translate',
      prompt: 'Translate to Spanish: "The boy eats bread."',
      correctAnswer: 'El niño come pan',
      distractors: ['la', 'niña', 'agua'],
      audioText: 'El niño come pan',
      lang: 'es-ES'
    },
    {
      id: 's3',
      type: 'match-pairs',
      prompt: 'Match the pairs',
      pairs: [
        { id: 'sp1', native: 'Apple', target: 'Manzana' },
        { id: 'sp2', native: 'Milk', target: 'Leche' },
        { id: 'sp3', native: 'Bread', target: 'Pan' },
        { id: 'sp4', native: 'Water', target: 'Agua' },
        { id: 'sp5', native: 'Boy', target: 'Niño' },
      ]
    }
  ]
};

export type QuestionType =
  | 'translate'
  | 'multiple-choice'
  | 'match-pairs'
  | 'listen-match'
  | 'tap-translate'
  | 'gap-fill';

export interface Question {
  id: string;
  type: QuestionType;
  prompt: string;
  instruction?: string;
  correctAnswer?: string;
  distractors?: string[];
  options?: { id: string; text: string; correct: boolean }[];
  sentence?: string;
  pairs?: { id: string; native: string; target: string }[];
  audioText?: string;
  lang?: string;
  hint?: string;
}

export type Category = 'Biznesowe' | 'Slang' | 'Codzienne' | 'Ogólne' | 'English' | 'Spanish';

export interface Lesson {
  id: string;
  title: string;
  category: Category;
  questions: Question[];
}

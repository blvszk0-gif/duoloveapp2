export type QuestionType = 'tap-translate' | 'multiple-choice' | 'gap-fill' | 'match-pairs' | 'translate';

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

export type Category = 'Biznesowe' | 'Slang' | 'Codzienne' | 'English' | 'Spanish';

export interface Lesson {
  id: string;
  title: string;
  category: Category;
  questions: Question[];
}

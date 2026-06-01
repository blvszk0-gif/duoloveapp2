import { Volume2 } from 'lucide-react';
import { playAudio } from '../utils/audio';
import MultipleChoice from './MultipleChoice';

interface ListenMatchProps {
  audioText: string;
  lang: string;
  options: { id: string; text: string; correct: boolean }[];
  onAnswer: (isCorrect: boolean, answer: string) => void;
  disabled?: boolean;
}

export default function ListenMatch({ audioText, lang, options, onAnswer, disabled }: ListenMatchProps) {
  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-xl mx-auto">
      <button
        onClick={() => playAudio(audioText, lang)}
        className="w-32 h-32 rounded-full bg-accent/20 border-4 border-accent text-accent flex items-center justify-center hover:bg-accent/30 transition-all shadow-lg group active:scale-95"
      >
        <Volume2 size={48} className="group-hover:scale-110 transition-transform" />
      </button>

      <MultipleChoice
        prompt="Co usłyszałeś?"
        options={options}
        onAnswer={onAnswer}
        disabled={disabled}
      />
    </div>
  );
}

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GapFillProps {
  prompt: string;
  sentence: string;
  correctAnswer: string;
  distractors: string[];
  onAnswer: (isCorrect: boolean, answer: string) => void;
  disabled?: boolean;
}

export default function GapFill({ prompt, sentence, correctAnswer, distractors, onAnswer, disabled }: GapFillProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const words = [...distractors, correctAnswer].sort(() => Math.random() - 0.5);

  const parts = sentence.split('___');

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-center">{prompt}</h2>
      
      <div className="text-2xl flex flex-wrap items-center justify-center gap-3 leading-loose">
        {parts[0]}
        <div className={`min-w-[120px] h-12 border-b-4 ${selected ? 'border-accent' : 'border-gray-700'} flex items-center justify-center px-4 transition-colors`}>
          <AnimatePresence mode="wait">
            {selected && (
              <motion.span
                key={selected}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                className="text-accent font-black cursor-pointer"
                onClick={() => !disabled && setSelected(null)}
              >
                {selected}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        {parts[1]}
      </div>

      <div className="flex flex-wrap gap-4 justify-center mt-8">
        {words.map((word, i) => (
          <motion.button
            key={i}
            disabled={disabled}
            whileTap={!disabled ? { scale: 0.9 } : {}}
            onClick={() => setSelected(word)}
            className={`px-8 py-3 bg-card rounded-2xl border-b-4 border-gray-800 shadow-md font-bold transition-all ${
              selected === word ? 'opacity-30 pointer-events-none' :
              disabled ? 'opacity-50' : 'hover:border-gray-600'
            }`}
          >
            {word}
          </motion.button>
        ))}
      </div>

      <button
        disabled={!selected || disabled}
        onClick={() => onAnswer(selected === correctAnswer, selected || '')}
        className={`mt-8 px-12 py-4 rounded-2xl font-black text-lg transition-all shadow-xl transform active:scale-95 ${
          selected && !disabled
            ? 'bg-orchid text-white hover:brightness-110 shadow-orchid/20'
            : 'bg-gray-800 text-gray-600 cursor-not-allowed opacity-50'
        }`}
      >
        SPRAWDŹ
      </button>
    </div>
  );
}

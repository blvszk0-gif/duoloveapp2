import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GapFillProps {
  prompt: string;
  sentence: string;
  correctAnswer: string;
  distractors: string[];
  onAnswer: (isCorrect: boolean, answer: string) => void;
}

export default function GapFill({ prompt, sentence, correctAnswer, distractors, onAnswer }: GapFillProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const words = [...distractors, correctAnswer].sort(() => Math.random() - 0.5);

  const parts = sentence.split('___');

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-center">{prompt}</h2>
      
      <div className="text-xl flex flex-wrap items-center justify-center gap-2 leading-loose">
        {parts[0]}
        <div className="min-w-[100px] h-10 border-b-2 border-accent flex items-center justify-center px-4">
          <AnimatePresence mode="wait">
            {selected && (
              <motion.span
                key={selected}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                className="text-accent font-bold cursor-pointer"
                onClick={() => setSelected(null)}
              >
                {selected}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        {parts[1]}
      </div>

      <div className="flex flex-wrap gap-3 justify-center mt-8">
        {words.map((word, i) => (
          <motion.button
            key={i}
            whileTap={{ scale: 0.9 }}
            onClick={() => setSelected(word)}
            className={`px-6 py-2 bg-card rounded-xl border-b-4 border-gray-800 shadow-md ${
              selected === word ? 'opacity-50 pointer-events-none' : ''
            }`}
          >
            {word}
          </motion.button>
        ))}
      </div>

      <button
        disabled={!selected}
        onClick={() => onAnswer(selected === correctAnswer, selected || '')}
        className={`mt-8 px-10 py-3 rounded-xl font-bold transition-all shadow-lg ${
          selected 
            ? 'bg-orchid text-white hover:brightness-110' 
            : 'bg-gray-700 text-gray-500 cursor-not-allowed'
        }`}
      >
        Check
      </button>
    </div>
  );
}

import { useState } from 'react';
import { motion } from 'framer-motion';

interface MultipleChoiceProps {
  prompt: string;
  options: { id: string; text: string; correct: boolean }[];
  onAnswer: (isCorrect: boolean, text: string) => void;
  disabled?: boolean;
}

export default function MultipleChoice({ prompt, options, onAnswer, disabled }: MultipleChoiceProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleCheck = () => {
    const selectedOption = options.find(o => o.id === selectedId);
    if (selectedOption) {
      onAnswer(selectedOption.correct, selectedOption.text);
    }
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-xl mx-auto">
      <h2 className="text-2xl font-bold text-center">{prompt}</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
        {options.map((option) => (
          <motion.button
            key={option.id}
            disabled={disabled}
            whileHover={!disabled ? { scale: 1.02 } : {}}
            whileTap={!disabled ? { scale: 0.98 } : {}}
            onClick={() => setSelectedId(option.id)}
            className={`p-6 border-2 rounded-3xl text-lg font-bold transition-all text-left flex items-center justify-between ${
              selectedId === option.id
                ? 'bg-accent/10 border-accent text-accent shadow-[0_0_15px_rgba(var(--color-accent),0.1)]'
                : 'bg-card border-gray-800 text-text hover:border-gray-600'
            } ${disabled ? 'opacity-50 cursor-default' : ''}`}
          >
            {option.text}
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
              selectedId === option.id ? 'border-accent bg-accent' : 'border-gray-700'
            }`}>
              {selectedId === option.id && <div className="w-2 h-2 bg-background rounded-full" />}
            </div>
          </motion.button>
        ))}
      </div>

      <button
        disabled={disabled || !selectedId}
        onClick={handleCheck}
        className={`mt-4 px-12 py-4 rounded-2xl font-black text-lg shadow-xl transition-all transform active:scale-95 ${
          disabled || !selectedId
            ? 'bg-gray-800 text-gray-600 cursor-not-allowed opacity-50'
            : 'bg-orchid text-white hover:brightness-110 shadow-orchid/20'
        }`}
      >
        SPRAWDŹ
      </button>
    </div>
  );
}

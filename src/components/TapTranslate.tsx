import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TapTranslateProps {
  prompt: string;
  correctAnswer: string;
  distractors: string[];
  onAnswer: (isCorrect: boolean, answer: string) => void;
  disabled?: boolean;
}

export default function TapTranslate({ prompt, correctAnswer, distractors, onAnswer, disabled }: TapTranslateProps) {
  const [availableWords, setAvailableWords] = useState<{word: string, id: string}[]>([]);
  const [selectedWords, setSelectedWords] = useState<{word: string, id: string}[]>([]);

  useEffect(() => {
    const words = [...correctAnswer.split(' '), ...distractors]
      .sort(() => Math.random() - 0.5)
      .map((w, i) => ({ word: w, id: `${w}-${i}` }));
    setAvailableWords(words);
    setSelectedWords([]);
  }, [correctAnswer, distractors]);

  const handleWordClick = (wordObj: {word: string, id: string}, isSelected: boolean) => {
    if (disabled) return;
    if (isSelected) {
      setSelectedWords(prev => prev.filter(w => w.id !== wordObj.id));
      setAvailableWords(prev => [...prev, wordObj]);
    } else {
      setAvailableWords(prev => prev.filter(w => w.id !== wordObj.id));
      setSelectedWords(prev => [...prev, wordObj]);
    }
  };

  const currentAnswer = selectedWords.map(w => w.word).join(' ');

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-center">{prompt}</h2>
      
      <div className="w-full min-h-[120px] p-6 bg-card/30 rounded-3xl border-2 border-dashed border-gray-700 flex flex-wrap gap-3 items-center justify-center">
        <AnimatePresence>
          {selectedWords.map((wordObj) => (
            <motion.button
              key={wordObj.id}
              layoutId={wordObj.id}
              disabled={disabled}
              onClick={() => handleWordClick(wordObj, true)}
              className="px-5 py-2.5 bg-accent text-background font-bold rounded-xl shadow-lg"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              {wordObj.word}
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      <div className="flex flex-wrap gap-3 justify-center">
        <AnimatePresence>
          {availableWords.map((wordObj) => (
            <motion.button
              key={wordObj.id}
              layoutId={wordObj.id}
              disabled={disabled}
              onClick={() => handleWordClick(wordObj, false)}
              className={`px-5 py-2.5 bg-card text-text border-b-4 border-gray-800 rounded-xl shadow-md transition-all ${
                disabled ? 'opacity-50' : 'active:border-b-0 active:translate-y-1 hover:border-gray-600'
              }`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              {wordObj.word}
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      <button
        disabled={disabled || selectedWords.length === 0}
        onClick={() => onAnswer(currentAnswer === correctAnswer, currentAnswer)}
        className={`mt-4 px-12 py-4 rounded-2xl font-black text-lg shadow-xl transition-all transform active:scale-95 ${
          disabled || selectedWords.length === 0
            ? 'bg-gray-800 text-gray-600 cursor-not-allowed opacity-50'
            : 'bg-orchid text-white hover:brightness-110 shadow-orchid/20'
        }`}
      >
        SPRAWDŹ
      </button>
    </div>
  );
}

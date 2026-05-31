import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TapTranslateProps {
  prompt: string;
  correctAnswer: string;
  distractors: string[];
  onAnswer: (isCorrect: boolean, answer: string) => void;
}

export default function TapTranslate({ prompt, correctAnswer, distractors, onAnswer }: TapTranslateProps) {
  const [availableWords, setAvailableWords] = useState<string[]>([]);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);

  useEffect(() => {
    const words = [...correctAnswer.split(' '), ...distractors].sort(() => Math.random() - 0.5);
    setAvailableWords(words);
    setSelectedWords([]);
  }, [correctAnswer, distractors]);

  const handleWordClick = (word: string, index: number, isSelected: boolean) => {
    if (isSelected) {
      setSelectedWords(prev => prev.filter((_, i) => i !== index));
      setAvailableWords(prev => [...prev, word]);
    } else {
      setAvailableWords(prev => prev.filter((_, i) => i !== index));
      setSelectedWords(prev => [...prev, word]);
    }
  };

  useEffect(() => {
    if (selectedWords.length > 0 && selectedWords.join(' ') === correctAnswer) {
      onAnswer(true, selectedWords.join(' '));
    }
  }, [selectedWords, correctAnswer]);

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-center">{prompt}</h2>
      
      <div className="w-full min-h-[100px] p-4 bg-card/50 rounded-xl border-2 border-dashed border-gray-600 flex flex-wrap gap-2 items-center justify-center">
        <AnimatePresence>
          {selectedWords.map((word, i) => (
            <motion.button
              key={`selected-${i}-${word}`}
              layoutId={`word-${word}-${i}`}
              onClick={() => handleWordClick(word, i, true)}
              className="px-4 py-2 bg-accent text-background font-bold rounded-lg shadow-md"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              {word}
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        <AnimatePresence>
          {availableWords.map((word, i) => (
            <motion.button
              key={`available-${i}-${word}`}
              layoutId={`word-${word}-${i}`}
              onClick={() => handleWordClick(word, i, false)}
              className="px-4 py-2 bg-card text-text border-b-4 border-gray-800 rounded-lg shadow-md active:border-b-0 active:translate-y-1 transition-all"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              {word}
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      <button
        onClick={() => onAnswer(selectedWords.join(' ') === correctAnswer, selectedWords.join(' '))}
        className="mt-4 px-8 py-3 bg-orchid text-white font-bold rounded-xl shadow-lg hover:brightness-110 transition-all"
      >
        Check Answer
      </button>
    </div>
  );
}

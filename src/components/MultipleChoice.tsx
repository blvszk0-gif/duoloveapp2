import { motion } from 'framer-motion';

interface MultipleChoiceProps {
  prompt: string;
  options: { id: string; text: string; correct: boolean }[];
  onAnswer: (isCorrect: boolean, text: string) => void;
}

export default function MultipleChoice({ prompt, options, onAnswer }: MultipleChoiceProps) {
  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-xl mx-auto">
      <h2 className="text-2xl font-bold text-center">{prompt}</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
        {options.map((option) => (
          <motion.button
            key={option.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95, y: 4 }}
            onClick={() => onAnswer(option.correct, option.text)}
            className="p-6 bg-card border-b-4 border-gray-800 rounded-2xl text-lg font-medium hover:bg-gray-700/50 transition-colors text-left"
          >
            {option.text}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

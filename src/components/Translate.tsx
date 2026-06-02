import { useState } from 'react';

interface TranslateProps {
  prompt: string;
  correctAnswer: string;
  onAnswer: (isCorrect: boolean, answer: string) => void;
  disabled?: boolean;
}

export default function Translate({ prompt, correctAnswer, onAnswer, disabled }: TranslateProps) {
  const [answer, setAnswer] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (disabled || !answer.trim()) return;

    const normalize = (text: string) => text.trim().toLowerCase().replace(/[.,!?¿¡]/g, '');
    const isCorrect = normalize(answer) === normalize(correctAnswer);
    onAnswer(isCorrect, answer);
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-xl mx-auto">
      <h2 className="text-2xl font-bold text-center">{prompt}</h2>

      <form onSubmit={handleSubmit} className="w-full">
        <textarea
          disabled={disabled}
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Wpisz tłumaczenie..."
          className="w-full p-6 bg-card border-2 border-gray-800 rounded-3xl text-xl focus:border-accent focus:outline-none transition-colors resize-none min-h-[150px]"
        />

        <button
          type="submit"
          disabled={disabled || !answer.trim()}
          className={`mt-8 w-full py-4 rounded-2xl font-black text-lg shadow-xl transition-all transform active:scale-95 ${
            disabled || !answer.trim()
              ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
              : 'bg-orchid text-white hover:brightness-110'
          }`}
        >
          SPRAWDŹ
        </button>
      </form>
    </div>
  );
}

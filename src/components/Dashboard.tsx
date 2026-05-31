import { POLISH_ENGLISH_LESSON, ENGLISH_SPANISH_LESSON } from '../data/lessons';
import type { Lesson } from '../data/lessons';
import { Languages } from 'lucide-react';

interface DashboardProps {
  onStartLesson: (lesson: Lesson) => void;
}

export default function Dashboard({ onStartLesson }: DashboardProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-4 text-center">
      <div className="mb-8">
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-accent to-orchid mb-4">
          DuoLove
        </h1>
        <p className="text-xl text-gray-400">Master languages with Leon Kennedy</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        <button
          onClick={() => onStartLesson(POLISH_ENGLISH_LESSON)}
          className="group p-8 bg-card border-2 border-gray-800 rounded-3xl hover:border-accent transition-all text-left flex items-center gap-6"
        >
          <div className="w-16 h-16 bg-accent/20 rounded-2xl flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
            <Languages size={32} />
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-1">Polish → English</h3>
            <p className="text-gray-400">Advanced (C1)</p>
          </div>
        </button>

        <button
          onClick={() => onStartLesson(ENGLISH_SPANISH_LESSON)}
          className="group p-8 bg-card border-2 border-gray-800 rounded-3xl hover:border-orchid transition-all text-left flex items-center gap-6"
        >
          <div className="w-16 h-16 bg-orchid/20 rounded-2xl flex items-center justify-center text-orchid group-hover:scale-110 transition-transform">
            <Languages size={32} />
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-1">English → Spanish</h3>
            <p className="text-gray-400">Beginner (A1)</p>
          </div>
        </button>
      </div>

      <div className="mt-12 text-gray-500 text-sm">
        Select a path to begin your training.
      </div>
    </div>
  );
}

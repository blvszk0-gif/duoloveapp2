import { useState } from 'react';
import type { Lesson, Category } from '../data/types';
import { Languages, Lock, CheckCircle, Star, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DashboardProps {
  onStartLesson: (lesson: Lesson) => void;
  completedLessonIds: string[];
  lessons: Lesson[];
}

export default function Dashboard({ onStartLesson, completedLessonIds, lessons }: DashboardProps) {
  const [selectedLang, setSelectedLang] = useState<'English' | 'Spanish'>('English');

  const filteredLessons = lessons.filter(l =>
    selectedLang === 'English' ? l.id.startsWith('en-') : l.id.startsWith('es-')
  );

  const categories: Category[] = Array.from(new Set(filteredLessons.map(l => l.category)));

  const totalLessons = filteredLessons.length;
  const completedCount = completedLessonIds.filter(id =>
    filteredLessons.find(l => l.id === id)
  ).length;

  const progress = totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0;

  const handleReset = () => {
    if (confirm('Czy na pewno chcesz zresetować cały postęp?')) {
        localStorage.removeItem('duolove_completed_lessons');
        localStorage.removeItem('duolove_last_score');
        window.location.reload();
    }
  };

  const isUnlocked = (lesson: Lesson) => {
    const categoryLessons = lessons.filter(l => l.category === lesson.category);
    const index = categoryLessons.findIndex(l => l.id === lesson.id);
    if (index === 0) return true;
    return completedLessonIds.includes(categoryLessons[index - 1].id);
  };

  return (
    <div className="flex flex-col items-center py-12 px-4 max-w-5xl mx-auto">
      <header className="w-full mb-12 text-center">
        <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-accent to-orchid mb-6">
          DuoLove
        </h1>

        <div className="max-w-md mx-auto bg-card p-6 rounded-3xl border border-gray-800 shadow-xl mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold text-gray-400">Postęp: {selectedLang === 'English' ? 'Angielski' : 'Hiszpański'}</span>
            <span className="text-accent font-black">{Math.round(progress)}% ({completedCount}/{totalLessons})</span>
          </div>
          <div className="h-4 bg-gray-900 rounded-full overflow-hidden border border-gray-800">
            <motion.div
              key={selectedLang}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-gradient-to-r from-accent to-orchid"
            />
          </div>
        </div>

        <div className="flex gap-4 justify-center bg-gray-900/50 p-2 rounded-2xl border border-gray-800 w-fit mx-auto">
          <button
            onClick={() => setSelectedLang('English')}
            className={`px-8 py-3 rounded-xl font-bold transition-all ${
              selectedLang === 'English'
                ? 'bg-accent text-white shadow-lg shadow-accent/20'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            Angielski
          </button>
          <button
            onClick={() => setSelectedLang('Spanish')}
            className={`px-8 py-3 rounded-xl font-bold transition-all ${
              selectedLang === 'Spanish'
                ? 'bg-accent text-white shadow-lg shadow-accent/20'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            Hiszpański
          </button>
        </div>
      </header>

      <div className="w-full space-y-12">
        <AnimatePresence mode="wait">
        <motion.div
          key={selectedLang}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="space-y-12"
        >
        {filteredLessons.length === 0 && (
            <div className="text-center py-20 bg-card rounded-3xl border-2 border-dashed border-gray-800">
                <p className="text-gray-500 mb-2">Brak dostępnych lekcji dla tego języka.</p>
                <p className="text-xs text-gray-600">Prawdopodobnie plik danych zawiera błędy (np. MYMEMORY WARNING).</p>
            </div>
        )}
        {categories.map(category => (
          <section key={category}>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Star className="text-orchid" size={24} />
              {category}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lessons.filter(l => l.category === category).map((lesson) => {
                const completed = completedLessonIds.includes(lesson.id);
                const unlocked = isUnlocked(lesson);

                return (
                  <button
                    key={lesson.id}
                    disabled={!unlocked}
                    onClick={() => onStartLesson(lesson)}
                    className={`group relative p-6 rounded-3xl border-2 transition-all text-left flex flex-col gap-4 shadow-lg ${
                      completed ? 'bg-success/5 border-success/50' :
                      unlocked ? 'bg-card border-gray-800 hover:border-accent hover:shadow-accent/10' :
                      'bg-gray-900/50 border-gray-800 opacity-60 cursor-not-allowed'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                      completed ? 'bg-success/20 text-success' :
                      unlocked ? 'bg-accent/20 text-accent' :
                      'bg-gray-800 text-gray-600'
                    }`}>
                      {completed ? <CheckCircle size={24} /> :
                       unlocked ? <Languages size={24} /> :
                       <Lock size={24} />}
                    </div>

                    <div>
                      <h3 className="text-xl font-bold mb-1">{lesson.title}</h3>
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-gray-500">
                          {lesson.questions.length} zadań
                        </p>
                        {completed && (
                          <span className="text-[10px] bg-success/20 text-success px-2 py-0.5 rounded-full font-bold uppercase">
                            Zaliczono
                          </span>
                        )}
                        {!unlocked && (
                          <span className="text-[10px] bg-gray-800 text-gray-500 px-2 py-0.5 rounded-full font-bold uppercase">
                            Zablokowane
                          </span>
                        )}
                      </div>
                    </div>

                    {!unlocked && (
                      <div className="absolute top-4 right-4 text-gray-600">
                        <Lock size={16} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </section>
        ))}
        </motion.div>
        </AnimatePresence>
      </div>

      <footer className="mt-16 flex flex-col items-center gap-4">
        <p className="text-gray-600 text-sm italic">
            Leon Kennedy czuwa nad Twoją nauką. Nie zawiedź go.
        </p>
        <button
            onClick={handleReset}
            className="flex items-center gap-2 text-red-500/50 hover:text-red-500 transition-colors text-xs font-bold"
        >
            <Trash2 size={14} /> Zresetuj postęp
        </button>
      </footer>
    </div>
  );
}

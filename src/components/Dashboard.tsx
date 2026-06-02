import { useState } from 'react';
import type { Lesson, Category } from '../data/types';
import { Languages, Lock, CheckCircle, Star, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Leon3D from './Leon3D';
import QuotesMarquee from './QuotesMarquee';
import ErrorBoundary from './ErrorBoundary';

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
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith('duolove_')) {
                localStorage.removeItem(key);
            }
        });
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
    <div className="flex flex-col lg:flex-row gap-8 py-12 px-4 max-w-7xl mx-auto">
      {/* Sidebar with Leon and Quotes */}
      <aside className="lg:w-1/3 flex flex-col gap-6 lg:sticky lg:top-12 lg:h-[calc(100vh-6rem)]">
        <div className="flex-1 bg-card rounded-[3rem] border border-gray-800 shadow-2xl overflow-hidden flex flex-col">
          <div className="h-4/5 bg-gradient-to-b from-accent/10 to-transparent relative">
            <ErrorBoundary>
              <Leon3D />
            </ErrorBoundary>
            <div className="absolute bottom-4 left-0 right-0 text-center">
              <span className="bg-background/80 backdrop-blur-md px-4 py-2 rounded-full border border-accent/20 text-xs font-bold text-accent uppercase tracking-widest">
                Leon Kennedy
              </span>
            </div>
          </div>
          <div className="h-1/5 p-2">
            <QuotesMarquee />
          </div>
        </div>

        <div className="bg-card p-6 rounded-3xl border border-gray-800 shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <span className="font-bold text-gray-400">Status nauki</span>
            <span className="text-accent font-black">{progress.toFixed(2)}%</span>
          </div>
          <div className="h-3 bg-gray-900 rounded-full overflow-hidden border border-gray-800 mb-2">
            <motion.div
              key={selectedLang}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-gradient-to-r from-accent to-orchid"
            />
          </div>
          <p className="text-[10px] text-gray-500 text-center uppercase tracking-tighter">
            {completedCount.toFixed(2)} z {totalLessons} lekcji ukończonych
          </p>
        </div>
      </aside>

      {/* Main Learning Path */}
      <main className="flex-1">
      <header className="w-full mb-12">
        <h1 className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-accent via-orchid to-accent animate-gradient-x mb-8">
          DuoLove
        </h1>

        <div className="flex justify-between items-center mb-12">
        <div className="flex gap-4 bg-gray-900/50 p-2 rounded-2xl border border-gray-800 w-fit">
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

        <button
            onClick={handleReset}
            className="flex items-center gap-2 text-red-500/30 hover:text-red-500 transition-colors text-[10px] font-bold uppercase tracking-widest"
        >
            <Trash2 size={12} /> Resetuj postęp
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
                    disabled={!unlocked || lesson.questions.every(q => (q as any).isPlaceholder)}
                    onClick={() => onStartLesson(lesson)}
                    className={`group relative p-6 rounded-3xl border-2 transition-all text-left flex flex-col gap-4 shadow-lg ${
                      completed ? 'bg-success/5 border-success/50' :
                      unlocked && !lesson.questions.every(q => (q as any).isPlaceholder) ? 'bg-card border-gray-800 hover:border-accent hover:shadow-accent/10' :
                      'bg-gray-900/50 border-gray-800 opacity-60 cursor-not-allowed'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                      completed ? 'bg-success/20 text-success' :
                      unlocked && !lesson.questions.every(q => (q as any).isPlaceholder) ? 'bg-accent/20 text-accent' :
                      'bg-gray-800 text-gray-600'
                    }`}>
                      {completed ? <CheckCircle size={24} /> :
                       unlocked && !lesson.questions.every(q => (q as any).isPlaceholder) ? <Languages size={24} /> :
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
                        {unlocked && lesson.questions.every(q => (q as any).isPlaceholder) && (
                          <span className="text-[10px] bg-orchid/20 text-orchid px-2 py-0.5 rounded-full font-bold uppercase">
                            W przygotowaniu
                          </span>
                        )}
                      </div>
                    </div>

                    {!unlocked && !lesson.questions.every(q => (q as any).isPlaceholder) && (
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
      </main>

      <footer className="hidden">
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

import { LESSONS } from '../data/lessons';
import type { Lesson, Category } from '../data/lessons';
import { Languages, Lock, CheckCircle, Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface DashboardProps {
  onStartLesson: (lesson: Lesson) => void;
  completedLessonIds: string[];
}

export default function Dashboard({ onStartLesson, completedLessonIds }: DashboardProps) {
  const categories: Category[] = ['Biznesowe', 'Slang', 'Codzienne'];

  const totalLessons = LESSONS.filter(l => categories.includes(l.category)).length;
  const completedCount = completedLessonIds.filter(id =>
    LESSONS.find(l => l.id === id && categories.includes(l.category))
  ).length;

  const overallProgress = (completedCount / totalLessons) * 100;

  const isUnlocked = (lesson: Lesson) => {
    const categoryLessons = LESSONS.filter(l => l.category === lesson.category);
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

        <div className="max-w-md mx-auto bg-card p-6 rounded-3xl border border-gray-800 shadow-xl">
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold text-gray-400">Twój postęp</span>
            <span className="text-accent font-black">{Math.round(overallProgress)}%</span>
          </div>
          <div className="h-4 bg-gray-900 rounded-full overflow-hidden border border-gray-800">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${overallProgress}%` }}
              className="h-full bg-gradient-to-r from-accent to-orchid"
            />
          </div>
        </div>
      </header>

      <div className="w-full space-y-12">
        {categories.map(category => (
          <section key={category}>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Star className="text-orchid" size={24} />
              {category}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {LESSONS.filter(l => l.category === category).map((lesson) => {
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
                      <p className="text-sm text-gray-500">
                        {lesson.questions.length} zadań
                      </p>
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
      </div>

      <footer className="mt-16 text-gray-600 text-sm italic">
        Leon Kennedy czuwa nad Twoją nauką. Nie zawiedź go.
      </footer>
    </div>
  );
}

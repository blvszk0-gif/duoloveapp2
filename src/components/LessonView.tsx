import { useState, useEffect } from 'react';
import type { Lesson } from '../data/types';
import Leon3D from './Leon3D';
import TapTranslate from './TapTranslate';
import MultipleChoice from './MultipleChoice';
import GapFill from './GapFill';
import MatchPairs from './MatchPairs';
import Translate from './Translate';
import ListenMatch from './ListenMatch';
import { playAudio } from '../utils/audio';
import { X, Volume2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ErrorBoundary from './ErrorBoundary';

interface LessonViewProps {
  lesson: Lesson;
  onExit: (score: number) => void;
}

export default function LessonView({ lesson, onExit }: LessonViewProps) {
  const [queue, setQueue] = useState<number[]>(lesson.questions.map((_, i) => i));
  const [completedCount, setCompletedCount] = useState(0);
  const [status, setStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [isResumed, setIsResumed] = useState(false);

  const SESSION_KEY = `duolove_session_${lesson.id}`;

  useEffect(() => {
    const saved = localStorage.getItem(SESSION_KEY);
    if (saved) {
      const { queue: savedQueue, completed } = JSON.parse(saved);
      if (savedQueue && savedQueue.length > 0) {
        setQueue(savedQueue);
        setCompletedCount(completed);
        setIsResumed(true);
      }
    }
  }, [lesson.id, SESSION_KEY]);

  useEffect(() => {
    localStorage.setItem(SESSION_KEY, JSON.stringify({ queue, completed: completedCount }));
  }, [queue, completedCount, SESSION_KEY]);

  const currentIndex = queue[0];
  const currentQuestion = lesson.questions[currentIndex];

  const handleAnswer = (isCorrect: boolean) => {
    if (status !== 'idle') return;

    if (isCorrect) {
      setStatus('correct');
      if (currentQuestion.audioText && currentQuestion.lang) {
          playAudio(currentQuestion.audioText, currentQuestion.lang);
      }
    } else {
      setStatus('incorrect');
    }
  };

  const handleNext = () => {
    if (status === 'correct') {
      setCompletedCount(prev => prev + 1);
      const newQueue = queue.slice(1);
      if (newQueue.length === 0) {
        localStorage.removeItem(SESSION_KEY);
        onExit(lesson.questions.length); // Full score if completed this way
        return;
      }
      setQueue(newQueue);
    } else {
      // Repeat at the end
      setQueue(prev => [...prev.slice(1), prev[0]]);
    }
    setStatus('idle');
  };

  const handleManualExit = () => {
    onExit(completedCount);
  };

  const playQuestionAudio = () => {
    if (currentQuestion.audioText && currentQuestion.lang) {
      playAudio(currentQuestion.audioText, currentQuestion.lang);
    }
  };

  const playPromptAudio = () => {
    if (currentQuestion.prompt && currentQuestion.nativeLang) {
      playAudio(currentQuestion.prompt, currentQuestion.nativeLang);
    }
  };

  const renderQuestion = () => {
    // ExerciseFactory
    switch (currentQuestion.type) {
      case 'translate':
        return (
          <Translate
            key={currentQuestion.id}
            prompt={currentQuestion.prompt}
            correctAnswer={currentQuestion.correctAnswer!}
            onAnswer={handleAnswer}
            disabled={status !== 'idle'}
          />
        );
      case 'tap-translate':
        return (
          <TapTranslate
            key={currentQuestion.id}
            prompt={currentQuestion.prompt}
            correctAnswer={currentQuestion.correctAnswer!}
            distractors={currentQuestion.distractors || []}
            onAnswer={handleAnswer}
            disabled={status !== 'idle'}
          />
        );
      case 'multiple-choice':
        return (
          <MultipleChoice
            key={currentQuestion.id}
            prompt={currentQuestion.prompt}
            options={currentQuestion.options!}
            onAnswer={handleAnswer}
            disabled={status !== 'idle'}
            lang={currentQuestion.lang}
          />
        );
      case 'gap-fill':
        return (
          <GapFill
            key={currentQuestion.id}
            prompt={currentQuestion.prompt}
            sentence={currentQuestion.sentence!}
            correctAnswer={currentQuestion.correctAnswer!}
            distractors={currentQuestion.distractors || []}
            onAnswer={handleAnswer}
            disabled={status !== 'idle'}
          />
        );
      case 'match-pairs':
        return (
          <MatchPairs
            key={currentQuestion.id}
            pairs={currentQuestion.pairs!}
            targetLang={currentQuestion.targetLang}
            onComplete={() => handleAnswer(true)}
            disabled={status !== 'idle'}
          />
        );
      case 'listen-match':
        return (
          <ListenMatch
            key={currentQuestion.id}
            audioText={currentQuestion.audioText!}
            lang={currentQuestion.lang!}
            options={currentQuestion.options!}
            onAnswer={handleAnswer}
            disabled={status !== 'idle'}
          />
        );
      default:
        return null;
    }
  };

  const progress = ((completedCount + (status === 'correct' ? 1 : 0)) / lesson.questions.length) * 100;

  return (
    <div className="min-h-screen flex flex-col max-w-4xl mx-auto p-4 pb-32">
      <header className="flex items-center gap-4 mb-8">
        <button onClick={handleManualExit} className="p-2 hover:bg-card rounded-full transition-colors">
          <X className="text-gray-400" />
        </button>
        <div className="flex-1 h-3 bg-card rounded-full overflow-hidden">
          <div 
            className="h-full bg-accent transition-all duration-500 ease-out shadow-[0_0_10px_rgba(255,107,157,0.5)]"
            style={{ width: `${progress}%` }} 
          />
        </div>
        {isResumed && (
            <span className="text-[10px] bg-orchid/20 text-orchid px-2 py-1 rounded-full font-bold uppercase animate-pulse">
                Wznowiono
            </span>
        )}
      </header>

      <main className="flex-1 flex flex-col gap-8">
        <ErrorBoundary>
          <Leon3D
            animationState={status === 'correct' ? 'jump_joy' : status === 'incorrect' ? 'facepalm' : 'idle'}
            showQuote={status === 'correct'}
          />
        </ErrorBoundary>

        <div className="flex-1 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
            >
              <div className="mb-4 text-center flex items-center justify-center gap-4">
                <span className="px-4 py-1 bg-card border border-gray-800 rounded-full text-xs text-gray-500 uppercase tracking-widest font-bold">
                  {currentQuestion.instruction || 'Zadanie'}
                </span>
                {currentQuestion.prompt && currentQuestion.nativeLang && currentQuestion.type !== 'listen-match' && (
                  <button
                    onClick={playPromptAudio}
                    className="p-2 hover:bg-card rounded-full text-accent transition-colors"
                    title="Słuchaj polecenia"
                  >
                    <Volume2 size={20} />
                  </button>
                )}
              </div>
              {renderQuestion()}
            </motion.div>
          </AnimatePresence>

        </div>
      </main>

      <footer className={`fixed bottom-0 left-0 right-0 p-8 transition-all duration-500 border-t ${
        status === 'correct' ? 'bg-success/10 border-success/30' :
        status === 'incorrect' ? 'bg-red-500/10 border-red-500/30' :
        'bg-background border-gray-800'
      } z-40`}>
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex-1">
            {status === 'correct' && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-success font-black text-2xl flex items-center gap-2"
              >
                <CheckCircle className="fill-success text-background" /> Świetnie!
              </motion.div>
            )}
            {status === 'incorrect' && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                <div className="text-red-400 font-bold text-lg mb-1">Poprawna odpowiedź:</div>
                <div className="text-white text-xl">{currentQuestion.correctAnswer}</div>
              </motion.div>
            )}
          </div>

          <div className="flex gap-4">
            {status === 'incorrect' && currentQuestion.audioText && (
              <button
                onClick={playQuestionAudio}
                className="p-4 bg-white/10 hover:bg-white/20 rounded-2xl transition-colors flex items-center gap-2 font-bold"
              >
                <Volume2 /> Słuchaj
              </button>
            )}
            
            {status !== 'idle' && (
              <button
                onClick={handleNext}
                className={`px-12 py-4 rounded-2xl font-black text-lg flex items-center gap-2 shadow-xl transition-all transform active:scale-95 ${
                  status === 'correct' ? 'bg-success text-black hover:brightness-110' :
                  'bg-red-500 text-white hover:brightness-110'
                }`}
              >
                Dalej <ArrowRight />
              </button>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}

function CheckCircle({ className }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

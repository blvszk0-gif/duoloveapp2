import { useState } from 'react';
import type { Lesson } from '../data/types';
import Leon3D from './Leon3D';
import TapTranslate from './TapTranslate';
import MultipleChoice from './MultipleChoice';
import GapFill from './GapFill';
import MatchPairs from './MatchPairs';
import Translate from './Translate';
import ListenMatch from './ListenMatch';
import { playAudio } from '../utils/audio';
import { X, Volume2, ArrowRight, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LessonViewProps {
  lesson: Lesson;
  onExit: (score: number) => void;
}

export default function LessonView({ lesson, onExit }: LessonViewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [showHint, setShowHint] = useState(false);

  const currentQuestion = lesson.questions[currentIndex];

  const handleAnswer = (isCorrect: boolean) => {
    if (status !== 'idle') return;

    if (isCorrect) {
      setScore(prev => prev + 1);
      setStatus('correct');
      // Auto play audio on correct if it exists
      if (currentQuestion.audioText && currentQuestion.lang) {
          playAudio(currentQuestion.audioText, currentQuestion.lang);
      }
    } else {
      setStatus('incorrect');
    }
  };

  const handleNext = () => {
    if (currentIndex < lesson.questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setStatus('idle');
      setShowHint(false);
    } else {
      onExit(score);
    }
  };

  const playQuestionAudio = () => {
    if (currentQuestion.audioText && currentQuestion.lang) {
      playAudio(currentQuestion.audioText, currentQuestion.lang);
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

  const progress = ((currentIndex + (status !== 'idle' ? 1 : 0)) / lesson.questions.length) * 100;

  return (
    <div className="min-h-screen flex flex-col max-w-4xl mx-auto p-4 pb-32">
      <header className="flex items-center gap-4 mb-8">
        <button onClick={() => onExit(score)} className="p-2 hover:bg-card rounded-full transition-colors">
          <X className="text-gray-400" />
        </button>
        <div className="flex-1 h-3 bg-card rounded-full overflow-hidden">
          <div 
            className="h-full bg-accent transition-all duration-500 ease-out shadow-[0_0_10px_rgba(255,107,157,0.5)]"
            style={{ width: `${progress}%` }} 
          />
        </div>
      </header>

      <main className="flex-1 flex flex-col gap-8">
        <Leon3D 
          animationState={status === 'correct' ? 'jump_joy' : status === 'incorrect' ? 'facepalm' : 'idle'} 
          showQuote={status === 'correct'}
        />

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
                {currentQuestion.audioText && currentQuestion.type !== 'listen-match' && (
                  <button
                    onClick={playQuestionAudio}
                    className="p-2 hover:bg-card rounded-full text-accent transition-colors"
                    title="Słuchaj"
                  >
                    <Volume2 size={20} />
                  </button>
                )}
              </div>
              {renderQuestion()}
            </motion.div>
          </AnimatePresence>

          {currentQuestion.hint && status === 'idle' && (
            <div className="mt-8 flex flex-col items-center">
              {!showHint ? (
                <button
                  onClick={() => setShowHint(true)}
                  className="flex items-center gap-2 text-gray-500 hover:text-accent transition-colors text-sm font-bold"
                >
                  <HelpCircle size={18} /> Pokaż podpowiedź
                </button>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-accent/10 border border-accent/20 p-4 rounded-2xl text-accent text-sm text-center max-w-sm"
                >
                  {currentQuestion.hint}
                </motion.div>
              )}
            </div>
          )}
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

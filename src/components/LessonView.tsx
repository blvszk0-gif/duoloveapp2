import { useState } from 'react';
import type { Lesson } from '../data/lessons';
import Leon3D from './Leon3D';
import TapTranslate from './TapTranslate';
import MultipleChoice from './MultipleChoice';
import GapFill from './GapFill';
import MatchPairs from './MatchPairs';
import { playAudio } from '../utils/audio';
import { X, Volume2, ArrowRight } from 'lucide-react';

interface LessonViewProps {
  lesson: Lesson;
  onExit: (score: number) => void;
}

export default function LessonView({ lesson, onExit }: LessonViewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [hasPlayedAudio, setHasPlayedAudio] = useState(false);

  const currentQuestion = lesson.questions[currentIndex];

  const handleAnswer = (isCorrect: boolean) => {
    if (status !== 'idle') return;

    if (isCorrect) {
      setScore(prev => prev + 1);
      setStatus('correct');
    } else {
      setStatus('incorrect');
      setHasPlayedAudio(false);
    }
  };

  const handleNext = () => {
    if (status === 'incorrect' && !hasPlayedAudio && currentQuestion.audioText) {
      return; // Must listen to audio if incorrect
    }

    if (currentIndex < lesson.questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setStatus('idle');
      setHasPlayedAudio(false);
    } else {
      onExit(score + (status === 'correct' ? 1 : 0));
    }
  };

  const playQuestionAudio = () => {
    if (currentQuestion.audioText && currentQuestion.lang) {
      playAudio(currentQuestion.audioText, currentQuestion.lang);
      setHasPlayedAudio(true);
    }
  };

  const renderQuestion = () => {
    switch (currentQuestion.type) {
      case 'tap-translate':
        return (
          <TapTranslate
            prompt={currentQuestion.prompt}
            correctAnswer={currentQuestion.correctAnswer!}
            distractors={currentQuestion.distractors || []}
            onAnswer={handleAnswer}
          />
        );
      case 'multiple-choice':
        return (
          <MultipleChoice
            prompt={currentQuestion.prompt}
            options={currentQuestion.options!}
            onAnswer={handleAnswer}
          />
        );
      case 'gap-fill':
        return (
          <GapFill
            prompt={currentQuestion.prompt}
            sentence={currentQuestion.sentence!}
            correctAnswer={currentQuestion.correctAnswer!}
            distractors={currentQuestion.distractors || []}
            onAnswer={handleAnswer}
          />
        );
      case 'match-pairs':
        return (
          <MatchPairs
            pairs={currentQuestion.pairs!}
            onComplete={() => handleAnswer(true)}
          />
        );
      default:
        return null;
    }
  };

  const progress = ((currentIndex + (status !== 'idle' ? 1 : 0)) / lesson.questions.length) * 100;

  return (
    <div className="min-h-screen flex flex-col max-w-4xl mx-auto p-4">
      <header className="flex items-center gap-4 mb-8">
        <button onClick={() => onExit(score)} className="p-2 hover:bg-card rounded-full transition-colors">
          <X className="text-gray-400" />
        </button>
        <div className="flex-1 h-3 bg-card rounded-full overflow-hidden">
          <div 
            className="h-full bg-success transition-all duration-500 ease-out" 
            style={{ width: `${progress}%` }} 
          />
        </div>
      </header>

      <main className="flex-1 flex flex-col gap-8">
        <Leon3D 
          animationState={status === 'correct' ? 'jump_joy' : status === 'incorrect' ? 'facepalm' : 'idle'} 
          showQuote={status === 'correct'}
        />

        <div className="flex-1">
          {renderQuestion()}
        </div>
      </main>

      <footer className={`fixed bottom-0 left-0 right-0 p-6 transition-all duration-300 ${
        status === 'correct' ? 'bg-success/20' : 
        status === 'incorrect' ? 'bg-red-500/20' : 
        'bg-background'
      }`}>
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            {status === 'correct' && (
              <div className="text-success font-bold text-xl">Excellent work!</div>
            )}
            {status === 'incorrect' && (
              <div className="text-red-400">
                <div className="font-bold text-xl mb-1">Correct answer:</div>
                <div>{currentQuestion.correctAnswer}</div>
                {!hasPlayedAudio && currentQuestion.audioText && (
                  <div className="text-sm mt-2">Listen to the correct answer to continue</div>
                )}
              </div>
            )}
          </div>

          <div className="flex gap-4">
            {status === 'incorrect' && currentQuestion.audioText && (
              <button
                onClick={playQuestionAudio}
                className="p-4 bg-white/10 hover:bg-white/20 rounded-xl transition-colors flex items-center gap-2 font-bold"
              >
                <Volume2 /> Listen
              </button>
            )}
            
            {status !== 'idle' && (
              <button
                onClick={handleNext}
                disabled={status === 'incorrect' && !hasPlayedAudio && !!currentQuestion.audioText}
                className={`px-10 py-4 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-all ${
                  status === 'correct' ? 'bg-success text-black' : 
                  (status === 'incorrect' && (!hasPlayedAudio && currentQuestion.audioText)) ? 'bg-gray-700 text-gray-500 cursor-not-allowed' :
                  'bg-red-500 text-white'
                }`}
              >
                Next <ArrowRight />
              </button>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}

import { useState, useEffect } from 'react'
import Dashboard from './components/Dashboard'
import LessonView from './components/LessonView'
import type { Lesson } from './data/lessons'

function App() {
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null)
  const [lastScore, setLastScore] = useState<number | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem('duolove_last_score')
    if (saved) {
      setLastScore(parseInt(saved))
    }
  }, [])

  const handleStartLesson = (lesson: Lesson) => {
    setCurrentLesson(lesson)
  }

  const handleExitLesson = (score: number) => {
    localStorage.setItem('duolove_last_score', score.toString())
    setLastScore(score)
    setCurrentLesson(null)
  }

  return (
    <div className="min-h-screen bg-background text-text">
      {!currentLesson ? (
        <div className="container mx-auto">
          {lastScore !== null && (
            <div className="absolute top-4 right-4 p-3 bg-card rounded-xl border border-accent/30 text-sm">
              Last Session Score: <span className="text-accent font-bold">{lastScore}</span>
            </div>
          )}
          <Dashboard onStartLesson={handleStartLesson} />
        </div>
      ) : (
        <LessonView lesson={currentLesson} onExit={handleExitLesson} />
      )}
    </div>
  )
}

export default App

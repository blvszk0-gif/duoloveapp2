import { useState, useEffect } from 'react'
import Dashboard from './components/Dashboard'
import LessonView from './components/LessonView'
import type { Lesson } from './data/lessons'

function App() {
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null)
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([])
  const [lastScore, setLastScore] = useState<number | null>(null)

  useEffect(() => {
    const savedCompleted = localStorage.getItem('duolove_completed_lessons')
    if (savedCompleted) {
      setCompletedLessonIds(JSON.parse(savedCompleted))
    }

    const savedScore = localStorage.getItem('duolove_last_score')
    if (savedScore) {
      setLastScore(parseInt(savedScore))
    }
  }, [])

  const handleStartLesson = (lesson: Lesson) => {
    setCurrentLesson(lesson)
  }

  const handleExitLesson = (score: number) => {
    if (currentLesson && score >= currentLesson.questions.length * 0.8) {
      const newCompleted = [...new Set([...completedLessonIds, currentLesson.id])]
      setCompletedLessonIds(newCompleted)
      localStorage.setItem('duolove_completed_lessons', JSON.stringify(newCompleted))
    }

    localStorage.setItem('duolove_last_score', score.toString())
    setLastScore(score)
    setCurrentLesson(null)
  }

  return (
    <div className="min-h-screen bg-background text-text">
      {!currentLesson ? (
        <div className="container mx-auto">
          {lastScore !== null && (
            <div className="fixed top-4 right-4 p-3 bg-card rounded-xl border border-accent/30 text-sm z-50">
              Last Session Score: <span className="text-accent font-bold">{lastScore}</span>
            </div>
          )}
          <Dashboard
            onStartLesson={handleStartLesson}
            completedLessonIds={completedLessonIds}
          />
        </div>
      ) : (
        <LessonView lesson={currentLesson} onExit={handleExitLesson} />
      )}
    </div>
  )
}

export default App

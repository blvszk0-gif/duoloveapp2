import { useState, useEffect } from 'react'
import Dashboard from './components/Dashboard'
import LessonView from './components/LessonView'
import { fetchLessons } from './data/api'
import type { Lesson } from './data/types'
import { Loader2 } from 'lucide-react'

function App() {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null)
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([])
  const [lastScore, setLastScore] = useState<number | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const data = await fetchLessons()
        setLessons(data)
      } catch (err) {
        setError('Nie udało się pobrać bazy lekcji. Sprawdź połączenie.')
      } finally {
        setLoading(false)
      }
    }

    loadData()

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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 text-accent animate-spin" />
        <p className="text-xl font-bold text-gray-400">Pobieranie bazy zadań...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-center">
        <div className="bg-red-500/10 border-2 border-red-500/30 p-8 rounded-3xl max-w-md">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Ups! Błąd połączenia</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-red-500 text-white font-bold rounded-xl hover:brightness-110 transition-all"
          >
            Spróbuj ponownie
          </button>
        </div>
      </div>
    )
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
            lessons={lessons}
          />
        </div>
      ) : (
        <LessonView lesson={currentLesson} onExit={handleExitLesson} />
      )}
    </div>
  )
}

export default App

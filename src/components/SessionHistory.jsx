import { useState } from 'react'
import { Plus, Clock, Trash2, Calendar } from 'lucide-react'
import { useProjects } from '../context/ProjectContext'

export default function SessionHistory({ project }) {
  const { dispatch } = useProjects()
  const [showAddForm, setShowAddForm] = useState(false)
  const [summary, setSummary] = useState('')
  const [duration, setDuration] = useState('')

  const handleAddSession = (e) => {
    e.preventDefault()
    if (!summary.trim()) return

    dispatch({
      type: 'ADD_SESSION',
      payload: {
        projectId: project.id,
        summary: summary.trim(),
        duration: parseInt(duration) || 0
      }
    })
    setSummary('')
    setDuration('')
    setShowAddForm(false)
  }

  const handleDeleteSession = (sessionId) => {
    if (confirm('Delete this session?')) {
      dispatch({
        type: 'DELETE_SESSION',
        payload: { projectId: project.id, sessionId }
      })
    }
  }

  return (
    <div>
      {/* Add Session Button/Form */}
      {!showAddForm ? (
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors mb-6"
        >
          <Plus className="w-4 h-4" />
          Log New Session
        </button>
      ) : (
        <form onSubmit={handleAddSession} className="bg-gray-800 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-medium text-gray-300 mb-3">Log a Claude Code session</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">What did you work on?</label>
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Fixed authentication bug, added new API endpoint..."
                rows={3}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm resize-none"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Duration (minutes, optional)</label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="30"
                min="0"
                className="w-32 px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={!summary.trim()}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white text-sm rounded-lg transition-colors"
              >
                Save Session
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddForm(false)
                  setSummary('')
                  setDuration('')
                }}
                className="px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-700 text-sm rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Session List */}
      {project.sessions.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Clock className="w-8 h-8 mx-auto mb-3 opacity-50" />
          <p>No sessions logged yet</p>
          <p className="text-sm mt-1">Log your Claude Code sessions to track your progress</p>
        </div>
      ) : (
        <div className="space-y-3">
          {project.sessions.map(session => (
            <div
              key={session.id}
              className="group bg-gray-800 border border-gray-700 rounded-lg p-4 hover:border-gray-600 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-gray-200">{session.summary}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(session.date).toLocaleDateString()} at {new Date(session.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    {session.duration > 0 && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {session.duration} min
                      </div>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteSession(session.id)}
                  className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

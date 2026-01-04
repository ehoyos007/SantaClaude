import { useState, useEffect } from 'react'
import { FileText, Save } from 'lucide-react'
import { useProjects } from '../context/ProjectContext'

export default function NotesEditor({ project }) {
  const { dispatch } = useProjects()
  const [notes, setNotes] = useState(project.notes || '')
  const [saved, setSaved] = useState(true)

  useEffect(() => {
    setNotes(project.notes || '')
    setSaved(true)
  }, [project.id, project.notes])

  const handleChange = (e) => {
    setNotes(e.target.value)
    setSaved(false)
  }

  const handleSave = () => {
    dispatch({
      type: 'UPDATE_NOTES',
      payload: { projectId: project.id, notes }
    })
    setSaved(true)
  }

  // Auto-save on blur
  const handleBlur = () => {
    if (!saved) {
      handleSave()
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-sm text-claude-text-tertiary">
          <FileText className="w-4 h-4" />
          <span>Markdown supported</span>
        </div>
        <div className="flex items-center gap-3">
          {!saved && (
            <span className="text-xs text-claude-accent">Unsaved changes</span>
          )}
          <button
            onClick={handleSave}
            disabled={saved}
            className="flex items-center gap-2 px-3 py-1.5 bg-claude-bg-surface border border-claude-border hover:bg-claude-bg-tertiary disabled:opacity-50 text-claude-text-primary text-sm rounded-claude-sm transition-colors"
          >
            <Save className="w-4 h-4" />
            Save
          </button>
        </div>
      </div>

      <textarea
        value={notes}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="Add notes about this project...

You can write:
- Project requirements
- Architecture decisions
- Important links
- Things to remember"
        className="w-full h-96 px-4 py-3 bg-claude-bg-surface border border-claude-border rounded-claude-md text-claude-text-primary placeholder-claude-text-tertiary focus:outline-none focus:ring-2 focus:ring-claude-accent focus:border-transparent font-mono text-sm resize-none"
      />

      <p className="text-xs text-claude-text-tertiary mt-2">
        Notes are saved automatically when you click away
      </p>
    </div>
  )
}

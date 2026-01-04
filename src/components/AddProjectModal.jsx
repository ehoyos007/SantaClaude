import { useState } from 'react'
import { X, FolderPlus } from 'lucide-react'
import { useProjects } from '../context/ProjectContext'

export default function AddProjectModal({ onClose, editProject = null }) {
  const { dispatch } = useProjects()
  const [name, setName] = useState(editProject?.name || '')
  const [path, setPath] = useState(editProject?.path || '')
  const [description, setDescription] = useState(editProject?.description || '')
  const [tagsInput, setTagsInput] = useState(editProject?.tags?.join(', ') || '')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim()) return

    const tags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0)

    if (editProject) {
      dispatch({
        type: 'UPDATE_PROJECT',
        payload: {
          id: editProject.id,
          updates: { name: name.trim(), path: path.trim(), description: description.trim(), tags }
        }
      })
    } else {
      dispatch({
        type: 'ADD_PROJECT',
        payload: { name: name.trim(), path: path.trim(), description: description.trim() }
      })
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-claude-text-primary/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-claude-bg-surface rounded-claude-lg border border-claude-border w-full max-w-md shadow-claude-lg">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-claude-border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-claude-accent-light rounded-claude-sm">
              <FolderPlus className="w-5 h-5 text-claude-accent" />
            </div>
            <h2 className="text-lg font-semibold text-claude-text-primary">
              {editProject ? 'Edit Project' : 'Add Project'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-claude-text-tertiary hover:text-claude-text-primary hover:bg-claude-bg-tertiary rounded-claude-sm transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-claude-text-primary mb-1.5">
              Project Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Awesome Project"
              className="w-full px-3 py-2.5 bg-claude-bg-primary border border-claude-border rounded-claude-sm text-claude-text-primary placeholder-claude-text-tertiary focus:outline-none focus:ring-2 focus:ring-claude-accent focus:border-transparent"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-claude-text-primary mb-1.5">
              Project Path
            </label>
            <input
              type="text"
              value={path}
              onChange={(e) => setPath(e.target.value)}
              placeholder="/Users/you/projects/my-project"
              className="w-full px-3 py-2.5 bg-claude-bg-primary border border-claude-border rounded-claude-sm text-claude-text-primary placeholder-claude-text-tertiary focus:outline-none focus:ring-2 focus:ring-claude-accent focus:border-transparent font-mono text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-claude-text-primary mb-1.5">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the project..."
              rows={3}
              className="w-full px-3 py-2.5 bg-claude-bg-primary border border-claude-border rounded-claude-sm text-claude-text-primary placeholder-claude-text-tertiary focus:outline-none focus:ring-2 focus:ring-claude-accent focus:border-transparent resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-claude-text-primary mb-1.5">
              Tags
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="react, typescript, api (comma separated)"
              className="w-full px-3 py-2.5 bg-claude-bg-primary border border-claude-border rounded-claude-sm text-claude-text-primary placeholder-claude-text-tertiary focus:outline-none focus:ring-2 focus:ring-claude-accent focus:border-transparent"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-claude-text-secondary hover:text-claude-text-primary hover:bg-claude-bg-tertiary rounded-claude-sm transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="px-4 py-2.5 bg-claude-accent hover:bg-claude-accent-hover disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-claude-sm transition-colors"
            >
              {editProject ? 'Save Changes' : 'Add Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

import { FolderGit2, Clock, CheckSquare, FileText, Trash2 } from 'lucide-react'
import { useProjects } from '../context/ProjectContext'

export default function ProjectCard({ project }) {
  const { dispatch } = useProjects()

  const completedTodos = project.todos.filter(t => t.completed).length
  const totalTodos = project.todos.length
  const lastSession = project.sessions[0]

  const handleDelete = (e) => {
    e.stopPropagation()
    if (confirm(`Delete "${project.name}"? This cannot be undone.`)) {
      dispatch({ type: 'DELETE_PROJECT', payload: project.id })
    }
  }

  return (
    <div
      onClick={() => dispatch({ type: 'SELECT_PROJECT', payload: project.id })}
      className="group bg-claude-bg-surface border border-claude-border rounded-claude-md p-5 hover:border-claude-accent hover:shadow-claude-md cursor-pointer transition-all duration-200"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-claude-bg-tertiary rounded-claude-sm group-hover:bg-claude-accent-light transition-colors">
            <FolderGit2 className="w-5 h-5 text-claude-text-secondary group-hover:text-claude-accent transition-colors" />
          </div>
          <div>
            <h3 className="font-semibold text-claude-text-primary">{project.name}</h3>
            {project.path && (
              <p className="text-xs text-claude-text-tertiary font-mono truncate max-w-[180px]">{project.path}</p>
            )}
          </div>
        </div>
        <button
          onClick={handleDelete}
          className="p-1.5 text-claude-text-tertiary hover:text-claude-error hover:bg-claude-bg-tertiary rounded-claude-sm opacity-0 group-hover:opacity-100 transition-all"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Description */}
      {project.description && (
        <p className="text-sm text-claude-text-secondary mb-3 line-clamp-2">{project.description}</p>
      )}

      {/* Tags */}
      {project.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {project.tags.slice(0, 3).map(tag => (
            <span key={tag} className="px-2 py-0.5 bg-claude-bg-tertiary text-claude-text-secondary text-xs rounded-full">
              {tag}
            </span>
          ))}
          {project.tags.length > 3 && (
            <span className="px-2 py-0.5 text-claude-text-tertiary text-xs">
              +{project.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Stats */}
      <div className="flex items-center gap-4 text-xs text-claude-text-tertiary">
        <div className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          <span>{project.sessions.length} session{project.sessions.length !== 1 ? 's' : ''}</span>
        </div>
        {totalTodos > 0 && (
          <div className="flex items-center gap-1">
            <CheckSquare className="w-3.5 h-3.5" />
            <span>{completedTodos}/{totalTodos}</span>
          </div>
        )}
        {project.notes && (
          <div className="flex items-center gap-1">
            <FileText className="w-3.5 h-3.5" />
            <span>Has notes</span>
          </div>
        )}
      </div>

      {/* Last Session */}
      {lastSession && (
        <div className="mt-3 pt-3 border-t border-claude-border">
          <p className="text-xs text-claude-text-tertiary">
            Last session: {new Date(lastSession.date).toLocaleDateString()}
          </p>
        </div>
      )}
    </div>
  )
}

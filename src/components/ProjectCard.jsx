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
      className="group bg-gray-800 border border-gray-700 rounded-lg p-4 hover:border-orange-500/50 hover:bg-gray-800/80 cursor-pointer transition-all"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-700 rounded-lg group-hover:bg-orange-500/20 transition-colors">
            <FolderGit2 className="w-5 h-5 text-gray-400 group-hover:text-orange-400 transition-colors" />
          </div>
          <div>
            <h3 className="font-medium text-gray-100">{project.name}</h3>
            {project.path && (
              <p className="text-xs text-gray-500 font-mono truncate max-w-[180px]">{project.path}</p>
            )}
          </div>
        </div>
        <button
          onClick={handleDelete}
          className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded opacity-0 group-hover:opacity-100 transition-all"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Description */}
      {project.description && (
        <p className="text-sm text-gray-400 mb-3 line-clamp-2">{project.description}</p>
      )}

      {/* Tags */}
      {project.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {project.tags.slice(0, 3).map(tag => (
            <span key={tag} className="px-2 py-0.5 bg-gray-700 text-gray-300 text-xs rounded-full">
              {tag}
            </span>
          ))}
          {project.tags.length > 3 && (
            <span className="px-2 py-0.5 text-gray-500 text-xs">
              +{project.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Stats */}
      <div className="flex items-center gap-4 text-xs text-gray-500">
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
        <div className="mt-3 pt-3 border-t border-gray-700">
          <p className="text-xs text-gray-500">
            Last session: {new Date(lastSession.date).toLocaleDateString()}
          </p>
        </div>
      )}
    </div>
  )
}

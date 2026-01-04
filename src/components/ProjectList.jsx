import { useState } from 'react'
import { Plus, Search, FolderOpen } from 'lucide-react'
import { useProjects } from '../context/ProjectContext'
import ProjectCard from './ProjectCard'
import AddProjectModal from './AddProjectModal'

export default function ProjectList() {
  const { state, dispatch, filteredProjects } = useProjects()
  const [showAddModal, setShowAddModal] = useState(false)

  return (
    <div>
      {/* Search and Actions Bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-claude-text-tertiary" />
          <input
            type="text"
            placeholder="Search projects..."
            value={state.searchQuery}
            onChange={(e) => dispatch({ type: 'SET_SEARCH', payload: e.target.value })}
            className="w-full pl-10 pr-4 py-2.5 bg-claude-bg-surface border border-claude-border rounded-claude-md text-claude-text-primary placeholder-claude-text-tertiary focus:outline-none focus:ring-2 focus:ring-claude-accent focus:border-transparent shadow-claude-sm"
          />
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-claude-accent hover:bg-claude-accent-hover text-white font-medium rounded-claude-md transition-colors shadow-claude-sm"
        >
          <Plus className="w-4 h-4" />
          Add Project
        </button>
      </div>

      {/* Project Grid */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-16">
          <div className="inline-flex p-4 bg-claude-bg-tertiary rounded-full mb-4">
            <FolderOpen className="w-8 h-8 text-claude-text-tertiary" />
          </div>
          <h3 className="text-lg font-medium text-claude-text-primary mb-2">
            {state.searchQuery ? 'No projects found' : 'No projects yet'}
          </h3>
          <p className="text-claude-text-secondary mb-4">
            {state.searchQuery
              ? 'Try adjusting your search query'
              : 'Add your first Claude Code project to get started'}
          </p>
          {!state.searchQuery && (
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-claude-bg-surface hover:bg-claude-bg-tertiary text-claude-text-primary border border-claude-border rounded-claude-md transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Project
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProjects.map(project => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}

      {/* Add Project Modal */}
      {showAddModal && (
        <AddProjectModal onClose={() => setShowAddModal(false)} />
      )}
    </div>
  )
}

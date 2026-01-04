import { useState } from 'react'
import { ArrowLeft, Edit2, Clock, FileText, CheckSquare, Terminal as TerminalIcon, SquareTerminal } from 'lucide-react'
import { useProjects } from '../context/ProjectContext'
import AddProjectModal from './AddProjectModal'
import SessionHistory from './SessionHistory'
import NotesEditor from './NotesEditor'
import TodoList from './TodoList'
import QuickLaunch from './QuickLaunch'
import Terminal from './Terminal'

const tabs = [
  { id: 'terminal', label: 'Terminal', icon: SquareTerminal },
  { id: 'sessions', label: 'Sessions', icon: Clock },
  { id: 'notes', label: 'Notes', icon: FileText },
  { id: 'todos', label: 'Todos', icon: CheckSquare },
  { id: 'launch', label: 'Quick Launch', icon: TerminalIcon },
]

export default function ProjectDetail() {
  const { dispatch, selectedProject } = useProjects()
  const [activeTab, setActiveTab] = useState('terminal')
  const [showEditModal, setShowEditModal] = useState(false)

  if (!selectedProject) {
    return (
      <div className="text-center py-16">
        <p className="text-claude-text-secondary">Project not found</p>
        <button
          onClick={() => dispatch({ type: 'DESELECT_PROJECT' })}
          className="mt-4 text-claude-accent hover:text-claude-accent-hover"
        >
          Back to projects
        </button>
      </div>
    )
  }

  const completedTodos = selectedProject.todos.filter(t => t.completed).length

  return (
    <div>
      {/* Back Button & Header */}
      <div className="mb-6">
        <button
          onClick={() => dispatch({ type: 'DESELECT_PROJECT' })}
          className="flex items-center gap-2 text-claude-text-secondary hover:text-claude-text-primary mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to projects
        </button>

        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-claude-text-primary mb-1">{selectedProject.name}</h2>
            {selectedProject.path && (
              <p className="text-sm text-claude-text-tertiary font-mono">{selectedProject.path}</p>
            )}
            {selectedProject.description && (
              <p className="text-claude-text-secondary mt-2">{selectedProject.description}</p>
            )}
            {selectedProject.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {selectedProject.tags.map(tag => (
                  <span key={tag} className="px-2.5 py-1 bg-claude-bg-tertiary text-claude-text-secondary text-sm rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={() => setShowEditModal(true)}
            className="flex items-center gap-2 px-3 py-2 text-claude-text-secondary hover:text-claude-text-primary hover:bg-claude-bg-tertiary rounded-claude-sm transition-colors"
          >
            <Edit2 className="w-4 h-4" />
            Edit
          </button>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-6 mt-4 text-sm text-claude-text-tertiary">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{selectedProject.sessions.length} sessions</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckSquare className="w-4 h-4" />
            <span>{completedTodos}/{selectedProject.todos.length} todos</span>
          </div>
          <div>
            Created {new Date(selectedProject.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-claude-border mb-6">
        <div className="flex gap-1">
          {tabs.map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'text-claude-accent border-claude-accent'
                    : 'text-claude-text-tertiary border-transparent hover:text-claude-text-primary'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className={activeTab === 'terminal' ? 'h-[500px]' : ''}>
        {activeTab === 'terminal' && <Terminal project={selectedProject} />}
        {activeTab === 'sessions' && <SessionHistory project={selectedProject} />}
        {activeTab === 'notes' && <NotesEditor project={selectedProject} />}
        {activeTab === 'todos' && <TodoList project={selectedProject} />}
        {activeTab === 'launch' && <QuickLaunch project={selectedProject} />}
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <AddProjectModal
          editProject={selectedProject}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </div>
  )
}

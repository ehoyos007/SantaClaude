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
        <p className="text-gray-500">Project not found</p>
        <button
          onClick={() => dispatch({ type: 'DESELECT_PROJECT' })}
          className="mt-4 text-orange-400 hover:text-orange-300"
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
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to projects
        </button>

        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">{selectedProject.name}</h2>
            {selectedProject.path && (
              <p className="text-sm text-gray-500 font-mono">{selectedProject.path}</p>
            )}
            {selectedProject.description && (
              <p className="text-gray-400 mt-2">{selectedProject.description}</p>
            )}
            {selectedProject.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {selectedProject.tags.map(tag => (
                  <span key={tag} className="px-2 py-1 bg-gray-800 text-gray-300 text-sm rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={() => setShowEditModal(true)}
            className="flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            <Edit2 className="w-4 h-4" />
            Edit
          </button>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-6 mt-4 text-sm text-gray-500">
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
      <div className="border-b border-gray-700 mb-6">
        <div className="flex gap-1">
          {tabs.map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'text-orange-400 border-orange-400'
                    : 'text-gray-400 border-transparent hover:text-gray-200'
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

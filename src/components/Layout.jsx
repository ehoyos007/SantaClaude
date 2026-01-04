import { Terminal, FolderGit2 } from 'lucide-react'
import { useProjects } from '../context/ProjectContext'

export default function Layout({ children }) {
  const { state, dispatch, filteredProjects } = useProjects()

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500/20 rounded-lg">
              <Terminal className="w-6 h-6 text-orange-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Claude Code Projects</h1>
              <p className="text-sm text-gray-400">Manage your AI-assisted development</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <FolderGit2 className="w-4 h-4" />
              <span>{filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        {children}
      </main>
    </div>
  )
}

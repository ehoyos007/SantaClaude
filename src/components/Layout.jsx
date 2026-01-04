import { Sparkles, FolderGit2, Sun, Moon } from 'lucide-react'
import { useProjects } from '../context/ProjectContext'
import { useTheme } from '../context/ThemeContext'

export default function Layout({ children }) {
  const { filteredProjects } = useProjects()
  const { isDark, toggleTheme } = useTheme()

  return (
    <div className="min-h-screen bg-claude-bg-primary text-claude-text-primary transition-colors duration-200">
      {/* Header */}
      <header className="bg-claude-bg-surface border-b border-claude-border px-6 py-4 shadow-claude-sm transition-colors duration-200">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-claude-accent-light rounded-claude-md">
              <Sparkles className="w-6 h-6 text-claude-accent" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-claude-text-primary">Claude Projects</h1>
              <p className="text-sm text-claude-text-tertiary">Manage your AI-assisted development</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-claude-text-secondary">
              <FolderGit2 className="w-4 h-4" />
              <span>{filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''}</span>
            </div>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-claude-sm bg-claude-bg-tertiary hover:bg-claude-border transition-colors duration-200"
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-claude-text-secondary" />
              ) : (
                <Moon className="w-5 h-5 text-claude-text-secondary" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  )
}

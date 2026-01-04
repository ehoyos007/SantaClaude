import { useState } from 'react'
import { Terminal, Copy, Check, ExternalLink } from 'lucide-react'

export default function QuickLaunch({ project }) {
  const [copied, setCopied] = useState(null)

  const commands = [
    {
      id: 'claude',
      label: 'Open with Claude Code',
      command: project.path ? `cd "${project.path}" && claude` : 'claude',
      description: 'Start a new Claude Code session in this project'
    },
    {
      id: 'claude-resume',
      label: 'Resume last session',
      command: project.path ? `cd "${project.path}" && claude --resume` : 'claude --resume',
      description: 'Continue your previous Claude Code conversation'
    },
    {
      id: 'vscode',
      label: 'Open in VS Code',
      command: project.path ? `code "${project.path}"` : 'code .',
      description: 'Launch Visual Studio Code for this project'
    },
    {
      id: 'terminal',
      label: 'Open Terminal',
      command: project.path ? `cd "${project.path}"` : '',
      description: 'Navigate to project directory'
    }
  ]

  const handleCopy = async (id, command) => {
    try {
      await navigator.clipboard.writeText(command)
      setCopied(id)
      setTimeout(() => setCopied(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div>
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Terminal className="w-4 h-4" />
        <span>Quick commands for this project</span>
      </div>

      {!project.path && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-6">
          <p className="text-yellow-400 text-sm">
            Add a project path to get customized commands
          </p>
        </div>
      )}

      <div className="space-y-3">
        {commands.map(cmd => (
          <div
            key={cmd.id}
            className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:border-gray-600 transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-gray-200 font-medium mb-1">{cmd.label}</h3>
                <p className="text-sm text-gray-500 mb-3">{cmd.description}</p>
                <code className="block bg-gray-900 px-3 py-2 rounded text-sm text-orange-400 font-mono overflow-x-auto">
                  {cmd.command || '(Set project path first)'}
                </code>
              </div>
              {cmd.command && (
                <button
                  onClick={() => handleCopy(cmd.id, cmd.command)}
                  className={`flex-shrink-0 p-2 rounded-lg transition-colors ${
                    copied === cmd.id
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-gray-700 text-gray-400 hover:text-white hover:bg-gray-600'
                  }`}
                >
                  {copied === cmd.id ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Tips */}
      <div className="mt-8 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
        <h3 className="text-sm font-medium text-gray-300 mb-2">Tips</h3>
        <ul className="text-sm text-gray-500 space-y-1">
          <li>Use <code className="text-orange-400">claude --help</code> to see all available options</li>
          <li>Press <code className="text-orange-400">Ctrl+C</code> to exit Claude Code at any time</li>
          <li>Your conversation history is saved automatically</li>
        </ul>
      </div>
    </div>
  )
}

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
      <div className="flex items-center gap-2 text-sm text-claude-text-tertiary mb-6">
        <Terminal className="w-4 h-4" />
        <span>Quick commands for this project</span>
      </div>

      {!project.path && (
        <div className="bg-amber-50 border border-amber-200 rounded-claude-md p-4 mb-6">
          <p className="text-amber-700 text-sm">
            Add a project path to get customized commands
          </p>
        </div>
      )}

      <div className="space-y-3">
        {commands.map(cmd => (
          <div
            key={cmd.id}
            className="bg-claude-bg-surface border border-claude-border rounded-claude-md p-4 hover:border-claude-accent/50 transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-claude-text-primary font-medium mb-1">{cmd.label}</h3>
                <p className="text-sm text-claude-text-tertiary mb-3">{cmd.description}</p>
                <code className="block bg-claude-bg-tertiary px-3 py-2 rounded-claude-sm text-sm text-claude-accent font-mono overflow-x-auto">
                  {cmd.command || '(Set project path first)'}
                </code>
              </div>
              {cmd.command && (
                <button
                  onClick={() => handleCopy(cmd.id, cmd.command)}
                  className={`flex-shrink-0 p-2 rounded-claude-sm transition-colors ${
                    copied === cmd.id
                      ? 'bg-green-50 text-claude-success'
                      : 'bg-claude-bg-tertiary text-claude-text-secondary hover:text-claude-text-primary hover:bg-claude-border'
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
      <div className="mt-8 p-4 bg-claude-bg-tertiary rounded-claude-md border border-claude-border">
        <h3 className="text-sm font-medium text-claude-text-primary mb-2">Tips</h3>
        <ul className="text-sm text-claude-text-secondary space-y-1">
          <li>Use <code className="text-claude-accent">claude --help</code> to see all available options</li>
          <li>Press <code className="text-claude-accent">Ctrl+C</code> to exit Claude Code at any time</li>
          <li>Your conversation history is saved automatically</li>
        </ul>
      </div>
    </div>
  )
}

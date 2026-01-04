import { useEffect, useRef, useState } from 'react'
import { Terminal as XTerm } from 'xterm'
import { FitAddon } from '@xterm/addon-fit'
import { Play, Square, RotateCcw, Terminal as TerminalIcon } from 'lucide-react'
import 'xterm/css/xterm.css'

export default function Terminal({ project, autoStart = false, command = null }) {
  const terminalRef = useRef(null)
  const xtermRef = useRef(null)
  const fitAddonRef = useRef(null)
  const terminalIdRef = useRef(null)
  const [isRunning, setIsRunning] = useState(false)
  const [isElectron, setIsElectron] = useState(false)

  useEffect(() => {
    // Check if running in Electron
    setIsElectron(window.electronAPI?.isElectron === true)
  }, [])

  useEffect(() => {
    if (!terminalRef.current || !isElectron) return

    // Initialize xterm
    const xterm = new XTerm({
      theme: {
        background: '#1f2937',
        foreground: '#e5e7eb',
        cursor: '#f97316',
        cursorAccent: '#1f2937',
        selectionBackground: '#374151',
        black: '#1f2937',
        red: '#ef4444',
        green: '#22c55e',
        yellow: '#eab308',
        blue: '#3b82f6',
        magenta: '#a855f7',
        cyan: '#06b6d4',
        white: '#e5e7eb',
        brightBlack: '#4b5563',
        brightRed: '#f87171',
        brightGreen: '#4ade80',
        brightYellow: '#facc15',
        brightBlue: '#60a5fa',
        brightMagenta: '#c084fc',
        brightCyan: '#22d3ee',
        brightWhite: '#f9fafb'
      },
      fontFamily: 'Menlo, Monaco, "Courier New", monospace',
      fontSize: 13,
      lineHeight: 1.2,
      cursorBlink: true,
      cursorStyle: 'bar',
      scrollback: 10000
    })

    const fitAddon = new FitAddon()
    xterm.loadAddon(fitAddon)

    xterm.open(terminalRef.current)
    fitAddon.fit()

    xtermRef.current = xterm
    fitAddonRef.current = fitAddon

    // Handle input
    xterm.onData((data) => {
      if (terminalIdRef.current) {
        window.electronAPI.writeTerminal(terminalIdRef.current, data)
      }
    })

    // Handle resize
    const handleResize = () => {
      if (fitAddonRef.current) {
        fitAddonRef.current.fit()
        if (terminalIdRef.current) {
          window.electronAPI.resizeTerminal(
            terminalIdRef.current,
            xterm.cols,
            xterm.rows
          )
        }
      }
    }

    const resizeObserver = new ResizeObserver(handleResize)
    resizeObserver.observe(terminalRef.current)
    window.addEventListener('resize', handleResize)

    // Listen for terminal data
    const removeDataListener = window.electronAPI.onTerminalData((id, data) => {
      if (id === terminalIdRef.current) {
        xterm.write(data)
      }
    })

    // Listen for terminal exit
    const removeExitListener = window.electronAPI.onTerminalExit((id) => {
      if (id === terminalIdRef.current) {
        xterm.writeln('\r\n\x1b[90m[Process exited]\x1b[0m')
        setIsRunning(false)
        terminalIdRef.current = null
      }
    })

    // Auto-start if requested
    if (autoStart) {
      startTerminal(command)
    }

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('resize', handleResize)
      removeDataListener()
      removeExitListener()
      if (terminalIdRef.current) {
        window.electronAPI.killTerminal(terminalIdRef.current)
      }
      xterm.dispose()
    }
  }, [isElectron])

  const startTerminal = async (cmd = null) => {
    if (!isElectron || isRunning) return

    const cwd = project?.path || undefined
    const terminalId = await window.electronAPI.createTerminal(cwd, cmd)
    terminalIdRef.current = terminalId
    setIsRunning(true)

    // Focus and resize
    xtermRef.current?.focus()
    if (fitAddonRef.current && xtermRef.current) {
      fitAddonRef.current.fit()
      window.electronAPI.resizeTerminal(
        terminalId,
        xtermRef.current.cols,
        xtermRef.current.rows
      )
    }
  }

  const stopTerminal = () => {
    if (terminalIdRef.current) {
      window.electronAPI.killTerminal(terminalIdRef.current)
      terminalIdRef.current = null
      setIsRunning(false)
    }
  }

  const restartTerminal = () => {
    stopTerminal()
    xtermRef.current?.clear()
    setTimeout(() => startTerminal(), 100)
  }

  const launchClaude = () => {
    if (isRunning) {
      // Send claude command to existing terminal
      window.electronAPI.writeTerminal(terminalIdRef.current, 'claude\r')
    } else {
      startTerminal('claude')
    }
  }

  if (!isElectron) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-claude-text-tertiary">
        <TerminalIcon className="w-12 h-12 mb-4 opacity-50" />
        <p className="text-lg mb-2 text-claude-text-secondary">Terminal requires Electron</p>
        <p className="text-sm">Run the app with <code className="text-claude-accent">npm run electron:dev</code></p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center gap-2 mb-3">
        {!isRunning ? (
          <button
            onClick={() => startTerminal()}
            className="flex items-center gap-2 px-3 py-1.5 bg-claude-success hover:opacity-90 text-white text-sm font-medium rounded-claude-sm transition-colors"
          >
            <Play className="w-4 h-4" />
            Start Terminal
          </button>
        ) : (
          <>
            <button
              onClick={stopTerminal}
              className="flex items-center gap-2 px-3 py-1.5 bg-claude-error hover:opacity-90 text-white text-sm font-medium rounded-claude-sm transition-colors"
            >
              <Square className="w-4 h-4" />
              Stop
            </button>
            <button
              onClick={restartTerminal}
              className="flex items-center gap-2 px-3 py-1.5 bg-claude-bg-tertiary hover:bg-claude-border text-claude-text-primary text-sm rounded-claude-sm transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Restart
            </button>
          </>
        )}
        <button
          onClick={launchClaude}
          className="flex items-center gap-2 px-3 py-1.5 bg-claude-accent hover:bg-claude-accent-hover text-white text-sm font-medium rounded-claude-sm transition-colors ml-auto"
        >
          <TerminalIcon className="w-4 h-4" />
          Run Claude
        </button>
      </div>

      {/* Terminal Container - stays dark */}
      <div
        ref={terminalRef}
        className="flex-1 bg-gray-800 rounded-claude-md overflow-hidden p-2"
        style={{ minHeight: '300px' }}
      />

      {/* Status */}
      <div className="flex items-center gap-2 mt-2 text-xs text-claude-text-tertiary">
        <div className={`w-2 h-2 rounded-full ${isRunning ? 'bg-claude-success' : 'bg-claude-border'}`} />
        <span>{isRunning ? 'Running' : 'Stopped'}</span>
        {project?.path && (
          <span className="ml-auto font-mono truncate max-w-xs">{project.path}</span>
        )}
      </div>
    </div>
  )
}

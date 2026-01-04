import pty from 'node-pty'
import os from 'os'

const terminals = new Map()
let terminalIdCounter = 0

const shell = process.platform === 'win32' ? 'powershell.exe' : process.env.SHELL || '/bin/zsh'

export function createTerminal(cwd, command, onData, onExit) {
  const terminalId = `terminal-${++terminalIdCounter}`

  const ptyProcess = pty.spawn(shell, [], {
    name: 'xterm-256color',
    cols: 80,
    rows: 24,
    cwd: cwd || os.homedir(),
    env: {
      ...process.env,
      TERM: 'xterm-256color',
      COLORTERM: 'truecolor'
    }
  })

  ptyProcess.onData((data) => {
    onData(data)
  })

  ptyProcess.onExit(() => {
    terminals.delete(terminalId)
    onExit()
  })

  terminals.set(terminalId, ptyProcess)

  // If a command was provided, execute it after a short delay
  if (command) {
    setTimeout(() => {
      ptyProcess.write(command + '\r')
    }, 100)
  }

  return terminalId
}

export function writeToTerminal(terminalId, data) {
  const ptyProcess = terminals.get(terminalId)
  if (ptyProcess) {
    ptyProcess.write(data)
  }
}

export function resizeTerminal(terminalId, cols, rows) {
  const ptyProcess = terminals.get(terminalId)
  if (ptyProcess) {
    ptyProcess.resize(cols, rows)
  }
}

export function killTerminal(terminalId) {
  const ptyProcess = terminals.get(terminalId)
  if (ptyProcess) {
    ptyProcess.kill()
    terminals.delete(terminalId)
  }
}

export function killAllTerminals() {
  for (const [id, ptyProcess] of terminals) {
    ptyProcess.kill()
  }
  terminals.clear()
}

export const STORAGE_KEY = 'claude-code-projects'

export function generateId() {
  return crypto.randomUUID()
}

export function createProject(name, path = '', description = '') {
  const now = new Date().toISOString()
  return {
    id: generateId(),
    name,
    path,
    description,
    tags: [],
    createdAt: now,
    updatedAt: now,
    sessions: [],
    notes: '',
    todos: []
  }
}

export function createSession(summary, duration = 0) {
  return {
    id: generateId(),
    date: new Date().toISOString(),
    summary,
    duration
  }
}

export function createTodo(text) {
  return {
    id: generateId(),
    text,
    completed: false
  }
}

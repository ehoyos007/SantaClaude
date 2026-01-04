import { createContext, useContext, useReducer, useEffect } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { STORAGE_KEY, createProject, createSession, createTodo } from '../utils/storage'

const ProjectContext = createContext(null)

const initialState = {
  projects: [],
  selectedProjectId: null,
  searchQuery: '',
  view: 'list' // 'list' | 'detail'
}

function projectReducer(state, action) {
  switch (action.type) {
    case 'LOAD_PROJECTS':
      return { ...state, projects: action.payload }

    case 'ADD_PROJECT': {
      const newProject = createProject(action.payload.name, action.payload.path, action.payload.description)
      return { ...state, projects: [...state.projects, newProject] }
    }

    case 'UPDATE_PROJECT': {
      const { id, updates } = action.payload
      return {
        ...state,
        projects: state.projects.map(p =>
          p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
        )
      }
    }

    case 'DELETE_PROJECT':
      return {
        ...state,
        projects: state.projects.filter(p => p.id !== action.payload),
        selectedProjectId: state.selectedProjectId === action.payload ? null : state.selectedProjectId,
        view: state.selectedProjectId === action.payload ? 'list' : state.view
      }

    case 'SELECT_PROJECT':
      return { ...state, selectedProjectId: action.payload, view: 'detail' }

    case 'DESELECT_PROJECT':
      return { ...state, selectedProjectId: null, view: 'list' }

    case 'SET_SEARCH':
      return { ...state, searchQuery: action.payload }

    case 'ADD_SESSION': {
      const { projectId, summary, duration } = action.payload
      const session = createSession(summary, duration)
      return {
        ...state,
        projects: state.projects.map(p =>
          p.id === projectId
            ? { ...p, sessions: [session, ...p.sessions], updatedAt: new Date().toISOString() }
            : p
        )
      }
    }

    case 'DELETE_SESSION': {
      const { projectId, sessionId } = action.payload
      return {
        ...state,
        projects: state.projects.map(p =>
          p.id === projectId
            ? { ...p, sessions: p.sessions.filter(s => s.id !== sessionId) }
            : p
        )
      }
    }

    case 'UPDATE_NOTES': {
      const { projectId, notes } = action.payload
      return {
        ...state,
        projects: state.projects.map(p =>
          p.id === projectId ? { ...p, notes, updatedAt: new Date().toISOString() } : p
        )
      }
    }

    case 'ADD_TODO': {
      const { projectId, text } = action.payload
      const todo = createTodo(text)
      return {
        ...state,
        projects: state.projects.map(p =>
          p.id === projectId
            ? { ...p, todos: [...p.todos, todo], updatedAt: new Date().toISOString() }
            : p
        )
      }
    }

    case 'TOGGLE_TODO': {
      const { projectId, todoId } = action.payload
      return {
        ...state,
        projects: state.projects.map(p =>
          p.id === projectId
            ? {
                ...p,
                todos: p.todos.map(t =>
                  t.id === todoId ? { ...t, completed: !t.completed } : t
                )
              }
            : p
        )
      }
    }

    case 'DELETE_TODO': {
      const { projectId, todoId } = action.payload
      return {
        ...state,
        projects: state.projects.map(p =>
          p.id === projectId
            ? { ...p, todos: p.todos.filter(t => t.id !== todoId) }
            : p
        )
      }
    }

    default:
      return state
  }
}

export function ProjectProvider({ children }) {
  const [savedProjects, setSavedProjects] = useLocalStorage(STORAGE_KEY, [])
  const [state, dispatch] = useReducer(projectReducer, { ...initialState, projects: savedProjects })

  // Sync to localStorage when projects change
  useEffect(() => {
    setSavedProjects(state.projects)
  }, [state.projects, setSavedProjects])

  const selectedProject = state.projects.find(p => p.id === state.selectedProjectId)

  const filteredProjects = state.projects.filter(p =>
    p.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
    p.tags.some(t => t.toLowerCase().includes(state.searchQuery.toLowerCase()))
  )

  return (
    <ProjectContext.Provider value={{ state, dispatch, selectedProject, filteredProjects }}>
      {children}
    </ProjectContext.Provider>
  )
}

export function useProjects() {
  const context = useContext(ProjectContext)
  if (!context) {
    throw new Error('useProjects must be used within a ProjectProvider')
  }
  return context
}

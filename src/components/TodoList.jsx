import { useState } from 'react'
import { Plus, Check, Trash2, CheckSquare } from 'lucide-react'
import { useProjects } from '../context/ProjectContext'

export default function TodoList({ project }) {
  const { dispatch } = useProjects()
  const [newTodo, setNewTodo] = useState('')

  const handleAddTodo = (e) => {
    e.preventDefault()
    if (!newTodo.trim()) return

    dispatch({
      type: 'ADD_TODO',
      payload: { projectId: project.id, text: newTodo.trim() }
    })
    setNewTodo('')
  }

  const handleToggle = (todoId) => {
    dispatch({
      type: 'TOGGLE_TODO',
      payload: { projectId: project.id, todoId }
    })
  }

  const handleDelete = (todoId) => {
    dispatch({
      type: 'DELETE_TODO',
      payload: { projectId: project.id, todoId }
    })
  }

  const completedCount = project.todos.filter(t => t.completed).length
  const pendingTodos = project.todos.filter(t => !t.completed)
  const completedTodos = project.todos.filter(t => t.completed)

  return (
    <div>
      {/* Add Todo Form */}
      <form onSubmit={handleAddTodo} className="flex gap-2 mb-6">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1 px-4 py-2.5 bg-claude-bg-surface border border-claude-border rounded-claude-sm text-claude-text-primary placeholder-claude-text-tertiary focus:outline-none focus:ring-2 focus:ring-claude-accent focus:border-transparent"
        />
        <button
          type="submit"
          disabled={!newTodo.trim()}
          className="flex items-center gap-2 px-4 py-2.5 bg-claude-accent hover:bg-claude-accent-hover disabled:opacity-50 text-white font-medium rounded-claude-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add
        </button>
      </form>

      {/* Progress */}
      {project.todos.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between text-sm text-claude-text-secondary mb-2">
            <span>Progress</span>
            <span>{completedCount} of {project.todos.length} completed</span>
          </div>
          <div className="h-2 bg-claude-bg-tertiary rounded-full overflow-hidden">
            <div
              className="h-full bg-claude-accent transition-all duration-300"
              style={{ width: `${(completedCount / project.todos.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Todo List */}
      {project.todos.length === 0 ? (
        <div className="text-center py-12 text-claude-text-tertiary">
          <CheckSquare className="w-8 h-8 mx-auto mb-3 opacity-50" />
          <p>No tasks yet</p>
          <p className="text-sm mt-1">Add tasks to track your project progress</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Pending Todos */}
          {pendingTodos.length > 0 && (
            <div className="space-y-2">
              {pendingTodos.map(todo => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={handleToggle}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}

          {/* Completed Todos */}
          {completedTodos.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-claude-text-tertiary mb-2 mt-6">Completed</h3>
              <div className="space-y-2">
                {completedTodos.map(todo => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    onToggle={handleToggle}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function TodoItem({ todo, onToggle, onDelete }) {
  return (
    <div className="group flex items-center gap-3 bg-claude-bg-surface border border-claude-border rounded-claude-sm p-3 hover:border-claude-accent/50 transition-colors">
      <button
        onClick={() => onToggle(todo.id)}
        className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
          todo.completed
            ? 'bg-claude-accent border-claude-accent'
            : 'border-claude-border hover:border-claude-accent'
        }`}
      >
        {todo.completed && <Check className="w-3 h-3 text-white" />}
      </button>
      <span className={`flex-1 ${todo.completed ? 'text-claude-text-tertiary line-through' : 'text-claude-text-primary'}`}>
        {todo.text}
      </span>
      <button
        onClick={() => onDelete(todo.id)}
        className="p-1.5 text-claude-text-tertiary hover:text-claude-error hover:bg-red-50 rounded-claude-sm opacity-0 group-hover:opacity-100 transition-all"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  )
}

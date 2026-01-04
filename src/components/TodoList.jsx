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
          className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
        <button
          type="submit"
          disabled={!newTodo.trim()}
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add
        </button>
      </form>

      {/* Progress */}
      {project.todos.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
            <span>Progress</span>
            <span>{completedCount} of {project.todos.length} completed</span>
          </div>
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-orange-500 transition-all duration-300"
              style={{ width: `${(completedCount / project.todos.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Todo List */}
      {project.todos.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
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
              <h3 className="text-sm font-medium text-gray-500 mb-2 mt-6">Completed</h3>
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
    <div className="group flex items-center gap-3 bg-gray-800 border border-gray-700 rounded-lg p-3 hover:border-gray-600 transition-colors">
      <button
        onClick={() => onToggle(todo.id)}
        className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
          todo.completed
            ? 'bg-orange-500 border-orange-500'
            : 'border-gray-600 hover:border-orange-500'
        }`}
      >
        {todo.completed && <Check className="w-3 h-3 text-white" />}
      </button>
      <span className={`flex-1 ${todo.completed ? 'text-gray-500 line-through' : 'text-gray-200'}`}>
        {todo.text}
      </span>
      <button
        onClick={() => onDelete(todo.id)}
        className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded opacity-0 group-hover:opacity-100 transition-all"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  )
}

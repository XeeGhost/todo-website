import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Check, X, Settings, StickyNote, CheckSquare, Edit2, Save, ChevronDown, ChevronRight, Calendar, Tag, Filter, Archive, Inbox, Briefcase, ShoppingCart, Menu, Sun, Moon } from 'lucide-react';

export default function TodoNotesApp() {
  const [activeTab, setActiveTab] = useState('todos');
  const [todoView, setTodoView] = useState('active');
  const [todos, setTodos] = useState([]);
  const [notes, setNotes] = useState([]);
  const [projects, setProjects] = useState(['Inbox', 'Work', 'Shopping']);
  const [selectedProject, setSelectedProject] = useState('Inbox');
  const [newTodo, setNewTodo] = useState('');
  const [newTodoDetails, setNewTodoDetails] = useState({
    dueDate: '',
    project: 'Inbox',
    labels: []
  });
  const [newNote, setNewNote] = useState({ title: '', content: '' });
  const [editingNote, setEditingNote] = useState(null);
  const [expandedTodos, setExpandedTodos] = useState({});
  const [newSubtask, setNewSubtask] = useState({});
  const [showSettings, setShowSettings] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [preferences, setPreferences] = useState({
    theme: 'light',
    fontSize: 'small',
    sortBy: 'date'
  });

  // Load data from memory on mount
  useEffect(() => {
    const savedTodos = window.appData?.todos || [];
    const savedNotes = window.appData?.notes || [];
    const savedPreferences = window.appData?.preferences || preferences;
    
    setTodos(savedTodos);
    setNotes(savedNotes);
    setPreferences(savedPreferences);
  }, []);

  // Save data to memory whenever it changes
  useEffect(() => {
    if (!window.appData) window.appData = {};
    window.appData.todos = todos;
    window.appData.notes = notes;
    window.appData.preferences = preferences;
  }, [todos, notes, preferences]);

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([...todos, {
        id: Date.now(),
        text: newTodo,
        completed: false,
        createdAt: new Date().toISOString(),
        priority: 'p4',
        dueDate: newTodoDetails.dueDate || null,
        project: selectedProject,
        subtasks: []
      }]);
      setNewTodo('');
      setNewTodoDetails({ dueDate: '', project: selectedProject, labels: [] });
    }
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed, completedAt: !todo.completed ? new Date().toISOString() : null } : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const setPriority = (id, priority) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, priority } : todo
    ));
  };

  const setDueDate = (id, dueDate) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, dueDate } : todo
    ));
  };

  const addSubtask = (todoId) => {
    const subtaskText = newSubtask[todoId];
    if (subtaskText && subtaskText.trim()) {
      setTodos(todos.map(todo => {
        if (todo.id === todoId) {
          return {
            ...todo,
            subtasks: [...todo.subtasks, {
              id: Date.now(),
              text: subtaskText,
              completed: false
            }]
          };
        }
        return todo;
      }));
      setNewSubtask({ ...newSubtask, [todoId]: '' });
    }
  };

  const toggleSubtask = (todoId, subtaskId) => {
    setTodos(todos.map(todo => {
      if (todo.id === todoId) {
        return {
          ...todo,
          subtasks: todo.subtasks.map(st => 
            st.id === subtaskId ? { ...st, completed: !st.completed } : st
          )
        };
      }
      return todo;
    }));
  };

  const deleteSubtask = (todoId, subtaskId) => {
    setTodos(todos.map(todo => {
      if (todo.id === todoId) {
        return {
          ...todo,
          subtasks: todo.subtasks.filter(st => st.id !== subtaskId)
        };
      }
      return todo;
    }));
  };

  const toggleExpanded = (id) => {
    setExpandedTodos({ ...expandedTodos, [id]: !expandedTodos[id] });
  };

  const getDaysUntilDue = (dueDate) => {
    if (!dueDate) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getDueDateColor = (dueDate) => {
    const days = getDaysUntilDue(dueDate);
    if (days === null) return '';
    if (days < 0) return 'text-red-500 dark:text-red-400';
    if (days === 0) return 'text-orange-500 dark:text-orange-400';
    if (days <= 3) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-green-600 dark:text-green-400';
  };

  const getDueDateText = (dueDate) => {
    if (!dueDate) return '';
    const days = getDaysUntilDue(dueDate);
    const date = new Date(dueDate);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Tomorrow';
    if (days === -1) return 'Yesterday';
    if (days < 0) return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    if (days <= 7) return date.toLocaleDateString('en-US', { weekday: 'short' });
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const addNote = () => {
    if (newNote.title.trim() || newNote.content.trim()) {
      setNotes([...notes, {
        id: Date.now(),
        title: newNote.title || 'Untitled Note',
        content: newNote.content,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }]);
      setNewNote({ title: '', content: '' });
    }
  };

  const updateNote = (id, updates) => {
    setNotes(notes.map(note => 
      note.id === id ? { ...note, ...updates, updatedAt: new Date().toISOString() } : note
    ));
    setEditingNote(null);
  };

  const deleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const getFilteredTodos = () => {
    let filtered = todoView === 'active' 
      ? todos.filter(t => !t.completed) 
      : todos.filter(t => t.completed);
    
    if (selectedProject !== 'All') {
      filtered = filtered.filter(t => t.project === selectedProject);
    }

    if (preferences.sortBy === 'priority') {
      const priorityOrder = { p1: 0, p2: 1, p3: 2, p4: 3 };
      return [...filtered].sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
    } else if (preferences.sortBy === 'dueDate') {
      return [...filtered].sort((a, b) => {
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      });
    }
    return [...filtered].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  };

  const getSortedNotes = () => {
    return [...notes].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  };

  const getProjectIcon = (project) => {
    if (project === 'Inbox') return <Inbox className="w-4 h-4" />;
    if (project === 'Work') return <Briefcase className="w-4 h-4" />;
    if (project === 'Shopping') return <ShoppingCart className="w-4 h-4" />;
    return <CheckSquare className="w-4 h-4" />;
  };

  const getPriorityColor = (priority) => {
    if (priority === 'p1') return 'text-red-500 border-red-500 dark:text-red-400 dark:border-red-400';
    if (priority === 'p2') return 'text-orange-500 border-orange-500 dark:text-orange-400 dark:border-orange-400';
    if (priority === 'p3') return 'text-blue-500 border-blue-500 dark:text-blue-400 dark:border-blue-400';
    return 'text-gray-400 border-gray-400 dark:text-gray-500 dark:border-gray-500';
  };

  const isDark = preferences.theme === 'dark';

  const toggleTheme = () => {
    setPreferences({...preferences, theme: isDark ? 'light' : 'dark'});
  };

  return (
    <div className={`min-h-screen flex ${isDark ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      {/* Sidebar */}
      {showSidebar && (
        <div className={`w-64 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r flex-shrink-0 transition-colors`}>
          <div className="p-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className={`font-semibold text-lg ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                Workspace
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleTheme}
                  className={`p-1.5 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}
                  title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                >
                  {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className={`p-1.5 rounded-lg transition-colors ${isDark ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}
                >
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Settings */}
            {showSettings && (
              <div className={`mb-4 p-3 rounded-lg space-y-3 ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <div>
                  <label className={`text-xs font-medium block mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Sort By
                  </label>
                  <select
                    value={preferences.sortBy}
                    onChange={(e) => setPreferences({...preferences, sortBy: e.target.value})}
                    className={`w-full p-2 text-sm rounded-md border transition-colors ${
                      isDark 
                        ? 'bg-gray-600 border-gray-500 text-gray-100' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="date">Date Created</option>
                    <option value="priority">Priority</option>
                    <option value="dueDate">Due Date</option>
                  </select>
                </div>
              </div>
            )}

            {/* Navigation */}
            <nav className="space-y-1">
              <button
                onClick={() => { setActiveTab('todos'); setTodoView('active'); setSelectedProject('All'); }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  activeTab === 'todos' && todoView === 'active' && selectedProject === 'All'
                    ? isDark ? 'bg-gray-700 text-gray-100' : 'bg-blue-50 text-blue-700'
                    : isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Inbox className="w-4 h-4" />
                <span className="flex-1 text-left text-sm font-medium">All Tasks</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  isDark ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-700'
                }`}>
                  {todos.filter(t => !t.completed).length}
                </span>
              </button>
              
              <button
                onClick={() => { setActiveTab('todos'); setTodoView('completed'); }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  todoView === 'completed'
                    ? isDark ? 'bg-gray-700 text-gray-100' : 'bg-blue-50 text-blue-700'
                    : isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Archive className="w-4 h-4" />
                <span className="flex-1 text-left text-sm font-medium">Completed</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  isDark ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-700'
                }`}>
                  {todos.filter(t => t.completed).length}
                </span>
              </button>

              <div className="pt-4 pb-2">
                <p className={`px-3 text-xs font-semibold uppercase tracking-wider ${
                  isDark ? 'text-gray-500' : 'text-gray-500'
                }`}>
                  Projects
                </p>
              </div>

              {projects.map(project => (
                <button
                  key={project}
                  onClick={() => { setActiveTab('todos'); setTodoView('active'); setSelectedProject(project); }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    selectedProject === project && todoView === 'active'
                      ? isDark ? 'bg-gray-700 text-gray-100' : 'bg-blue-50 text-blue-700'
                      : isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {getProjectIcon(project)}
                  <span className="flex-1 text-left text-sm font-medium">{project}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    isDark ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-700'
                  }`}>
                    {todos.filter(t => !t.completed && t.project === project).length}
                  </span>
                </button>
              ))}

              <div className="pt-4">
                <button
                  onClick={() => setActiveTab('notes')}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    activeTab === 'notes'
                      ? isDark ? 'bg-gray-700 text-gray-100' : 'bg-blue-50 text-blue-700'
                      : isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <StickyNote className="w-4 h-4" />
                  <span className="flex-1 text-left text-sm font-medium">Notes</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    isDark ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-700'
                  }`}>
                    {notes.length}
                  </span>
                </button>
              </div>
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className={`border-b p-4 flex items-center gap-3 ${
          isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
        }`}>
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className={`p-2 rounded-lg transition-colors ${
              isDark ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className={`text-xl font-semibold ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
            {activeTab === 'notes' ? 'Notes' : todoView === 'completed' ? 'Completed Tasks' : selectedProject === 'All' ? 'All Tasks' : selectedProject}
          </h1>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'todos' && (
            <div className="max-w-4xl mx-auto p-6">
              {/* Add Todo */}
              {todoView === 'active' && (
                <div className={`mb-6 p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
                  <div className="flex items-center gap-3">
                    <button className={`w-5 h-5 rounded-full border-2 flex-shrink-0 ${
                      isDark ? 'border-gray-600' : 'border-gray-300'
                    }`}></button>
                    <input
                      type="text"
                      value={newTodo}
                      onChange={(e) => setNewTodo(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addTodo()}
                      placeholder="Add a new task..."
                      className={`flex-1 p-2 bg-transparent outline-none text-sm ${
                        isDark ? 'text-gray-100 placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'
                      }`}
                    />
                    <input
                      type="date"
                      value={newTodoDetails.dueDate}
                      onChange={(e) => setNewTodoDetails({...newTodoDetails, dueDate: e.target.value})}
                      className={`p-2 text-xs rounded-md border ${
                        isDark ? 'bg-gray-700 border-gray-600 text-gray-300' : 'bg-white border-gray-300 text-gray-700'
                      }`}
                    />
                    <button
                      onClick={addTodo}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-4 py-2 rounded-lg transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>
              )}

              {/* Todo List */}
              <div className="space-y-2">
                {getFilteredTodos().map(todo => (
                  <div
                    key={todo.id}
                    className={`group rounded-lg p-4 transition-all ${
                      isDark 
                        ? 'bg-gray-800 hover:bg-gray-750' 
                        : 'bg-white hover:bg-gray-50 shadow-sm'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => toggleTodo(todo.id)}
                        className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                          todo.completed
                            ? isDark ? 'bg-gray-600 border-gray-600' : 'bg-gray-400 border-gray-400'
                            : getPriorityColor(todo.priority) + ' hover:scale-110'
                        }`}
                      >
                        {todo.completed && <Check className="w-3 h-3 text-white" />}
                      </button>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className={`text-sm font-medium ${
                            todo.completed 
                              ? isDark ? 'line-through text-gray-500' : 'line-through text-gray-400'
                              : isDark ? 'text-gray-100' : 'text-gray-900'
                          }`}>
                            {todo.text}
                          </span>
                          {todo.dueDate && (
                            <span className={`text-xs font-medium px-2 py-0.5 rounded ${getDueDateColor(todo.dueDate)}`}>
                              {getDueDateText(todo.dueDate)}
                            </span>
                          )}
                          {todo.subtasks.length > 0 && (
                            <span className={`text-xs px-2 py-0.5 rounded ${
                              isDark ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-600'
                            }`}>
                              {todo.subtasks.filter(st => st.completed).length}/{todo.subtasks.length}
                            </span>
                          )}
                        </div>
                        
                        {expandedTodos[todo.id] && (
                          <div className="mt-3 ml-8 space-y-3 pb-2">
                            {/* Priority */}
                            <div className="flex gap-2">
                              <span className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                Priority:
                              </span>
                              {['p1', 'p2', 'p3', 'p4'].map(p => (
                                <button
                                  key={p}
                                  onClick={() => setPriority(todo.id, p)}
                                  className={`w-6 h-6 rounded border-2 transition-all ${
                                    todo.priority === p ? getPriorityColor(p) + ' scale-110' : isDark ? 'border-gray-600' : 'border-gray-300'
                                  }`}
                                  title={`Priority ${p.slice(1)}`}
                                ></button>
                              ))}
                            </div>

                            {/* Subtasks */}
                            {todo.subtasks.map(subtask => (
                              <div key={subtask.id} className="flex items-center gap-3">
                                <button
                                  onClick={() => toggleSubtask(todo.id, subtask.id)}
                                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                                    subtask.completed 
                                      ? isDark ? 'bg-gray-600 border-gray-600' : 'bg-gray-400 border-gray-400'
                                      : isDark ? 'border-gray-600' : 'border-gray-400'
                                  }`}
                                >
                                  {subtask.completed && <Check className="w-2.5 h-2.5 text-white" />}
                                </button>
                                <span className={`flex-1 text-sm ${
                                  subtask.completed 
                                    ? isDark ? 'line-through text-gray-500' : 'line-through text-gray-400'
                                    : isDark ? 'text-gray-300' : 'text-gray-700'
                                }`}>
                                  {subtask.text}
                                </span>
                                <button
                                  onClick={() => deleteSubtask(todo.id, subtask.id)}
                                  className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-600 p-1 transition-opacity"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                            
                            <div className="flex items-center gap-3">
                              <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${
                                isDark ? 'border-gray-600' : 'border-gray-300'
                              }`}></div>
                              <input
                                type="text"
                                value={newSubtask[todo.id] || ''}
                                onChange={(e) => setNewSubtask({...newSubtask, [todo.id]: e.target.value})}
                                onKeyPress={(e) => e.key === 'Enter' && addSubtask(todo.id)}
                                placeholder="Add sub-task..."
                                className={`flex-1 p-1 text-sm bg-transparent outline-none ${
                                  isDark ? 'text-gray-300 placeholder-gray-600' : 'text-gray-700 placeholder-gray-400'
                                }`}
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => toggleExpanded(todo.id)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
                          }`}
                        >
                          {expandedTodos[todo.id] ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => deleteTodo(todo.id)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            isDark ? 'hover:bg-red-900/30 text-red-400' : 'hover:bg-red-50 text-red-600'
                          }`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {getFilteredTodos().length === 0 && (
                  <div className={`text-center py-16 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    <div className="text-lg font-medium mb-2">
                      {todoView === 'active' ? 'No tasks yet' : 'No completed tasks'}
                    </div>
                    <p className="text-sm">
                      {todoView === 'active' ? 'Add your first task above to get started!' : 'Complete tasks to see them here'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Notes Section */}
          {activeTab === 'notes' && (
            <div className="max-w-6xl mx-auto p-6">
              <div className={`mb-6 rounded-lg p-4 ${isDark ? 'bg-gray-800' : 'bg-white shadow-sm'}`}>
                <input
                  type="text"
                  value={newNote.title}
                  onChange={(e) => setNewNote({...newNote, title: e.target.value})}
                  placeholder="Note title..."
                  className={`w-full p-3 mb-3 rounded-lg border text-sm font-medium ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-500' 
                      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                  }`}
                />
                <textarea
                  value={newNote.content}
                  onChange={(e) => setNewNote({...newNote, content: e.target.value})}
                  placeholder="Note content..."
                  rows="4"
                  className={`w-full p-3 mb-3 rounded-lg border text-sm ${
                    isDark 
                      ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-500' 
                      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                  }`}
                />
                <button
                  onClick={addNote}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium text-sm transition-colors"
                >
                  Add Note
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {getSortedNotes().map(note => (
                  <div
                    key={note.id}
                    className={`rounded-lg p-4 hover:shadow-lg transition-all ${
                      isDark ? 'bg-gray-800' : 'bg-white shadow-sm'
                    }`}
                  >
                    {editingNote === note.id ? (
                      <div>
                        <input
                          type="text"
                          defaultValue={note.title}
                          id={`edit-title-${note.id}`}
                          className={`w-full p-2 mb-3 rounded-lg border text-sm font-semibold ${
                            isDark ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-gray-50 border-gray-200 text-gray-900'
                          }`}
                        />
                        <textarea
                          defaultValue={note.content}
                          id={`edit-content-${note.id}`}
                          rows="4"
                          className={`w-full p-2 mb-3 rounded-lg border text-sm ${
                            isDark ? 'bg-gray-700 border-gray-600 text-gray-100' : 'bg-gray-50 border-gray-200 text-gray-900'
                          }`}
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              const title = document.getElementById(`edit-title-${note.id}`).value;
                              const content = document.getElementById(`edit-content-${note.id}`).value;
                              updateNote(note.id, { title, content });
                            }}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingNote(null)}
                            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                              isDark ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                            }`}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h3 className={`font-semibold mb-2 text-base ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                          {note.title}
                        </h3>
                        <p className={`text-sm mb-3 line-clamp-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          {note.content}
                        </p>
                        <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                          <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                            {new Date(note.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                          <div className="flex gap-1">
                            <button
                              onClick={() => setEditingNote(note.id)}
                              className={`p-1.5 rounded-lg transition-colors ${
                                isDark ? 'text-blue-400 hover:bg-blue-900/30' : 'text-blue-600 hover:bg-blue-50'
                              }`}
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteNote(note.id)}
                              className={`p-1.5 rounded-lg transition-colors ${
                                isDark ? 'text-red-400 hover:bg-red-900/30' : 'text-red-600 hover:bg-red-50'
                              }`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {notes.length === 0 && (
                  <div className={`col-span-full text-center py-16 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    <div className="text-lg font-medium mb-2">No notes yet</div>
                    <p className="text-sm">Create your first note above!</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
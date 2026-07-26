'use client';

import React, { useState } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { ColumnData, Task } from '../types/kanban';
import { TaskCard } from './TaskCard';

interface ColumnProps {
  column: ColumnData;
  tasks: Task[];
  onAddTask: (columnId: string, title: string, details: string) => void;
  onDeleteTask: (taskId: string, columnId: string) => void;
  onUpdateTask: (taskId: string, newTitle: string, newDetails: string) => void;
  onRenameColumn: (columnId: string, newTitle: string) => void;
}

export const Column: React.FC<ColumnProps> = ({
  column,
  tasks,
  onAddTask,
  onDeleteTask,
  onUpdateTask,
  onRenameColumn,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [columnTitle, setColumnTitle] = useState(column.title);

  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDetails, setNewDetails] = useState('');

  const handleTitleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRenameColumn(column.id, columnTitle);
    setIsEditingTitle(false);
  };

  const handleAddTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddTask(column.id, newTitle, newDetails);
    setNewTitle('');
    setNewDetails('');
    setIsAddingTask(false);
  };

  return (
    <section
      id={`column-${column.id}`}
      aria-label={`Columna ${column.title}`}
      className="flex flex-col w-80 min-w-[320px] bg-[#111A2E]/90 backdrop-blur-sm border border-slate-800 rounded-2xl p-4 shadow-xl shadow-black/40 h-[calc(100vh-140px)]"
    >
      {/* Column Header */}
      <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-800">
        {isEditingTitle ? (
          <form onSubmit={handleTitleSubmit} className="flex-1 flex items-center gap-2">
            <input
              type="text"
              id={`edit-col-title-input-${column.id}`}
              value={columnTitle}
              onChange={(e) => setColumnTitle(e.target.value)}
              onBlur={handleTitleSubmit}
              autoFocus
              className="w-full bg-[#1C2541] border border-[#00B4D8] rounded-lg px-2.5 py-1 text-sm font-semibold text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
            />
          </form>
        ) : (
          <div className="flex items-center gap-2 flex-1 group cursor-pointer" onClick={() => setIsEditingTitle(true)}>
            <div className="w-2.5 h-2.5 rounded-full bg-[#00B4D8]" />
            <h3
              id={`column-title-${column.id}`}
              className="font-bold text-slate-100 text-sm tracking-wide group-hover:text-[#90E0EF] transition-colors"
            >
              {column.title}
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#03045E]/80 text-[#90E0EF] border border-[#0077B6]/40">
              {tasks.length}
            </span>
          </div>
        )}

        <button
          type="button"
          id={`btn-edit-col-${column.id}`}
          onClick={() => setIsEditingTitle(!isEditingTitle)}
          aria-label={`Renombrar columna ${column.title}`}
          className="p-1.5 text-slate-400 hover:text-[#90E0EF] hover:bg-slate-800/80 rounded-lg transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </button>
      </div>

      {/* Task List (Droppable Area) */}
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            id={`droppable-${column.id}`}
            className={`flex-1 overflow-y-auto space-y-3 pr-1 transition-colors rounded-xl p-1 ${
              snapshot.isDraggingOver ? 'bg-[#0077B6]/10 ring-1 ring-[#00B4D8]/30' : ''
            }`}
          >
            {tasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                index={index}
                columnId={column.id}
                onDelete={onDeleteTask}
                onUpdate={onUpdateTask}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      {/* Add Task Section */}
      <div className="pt-3 mt-2 border-t border-slate-800/80">
        {isAddingTask ? (
          <form onSubmit={handleAddTaskSubmit} className="space-y-3 p-3 bg-[#162032] border border-slate-700/80 rounded-xl shadow-lg">
            <div>
              <label htmlFor={`input-title-${column.id}`} className="block text-[11px] font-medium text-slate-300 mb-1">
                Titulo
              </label>
              <input
                type="text"
                id={`input-title-${column.id}`}
                placeholder="Nombre de la tarea..."
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                required
                autoFocus
                className="w-full bg-[#0B132B] border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#00B4D8] focus:ring-1 focus:ring-[#00B4D8]"
              />
            </div>
            <div>
              <label htmlFor={`input-details-${column.id}`} className="block text-[11px] font-medium text-slate-300 mb-1">
                Detalles
              </label>
              <textarea
                id={`input-details-${column.id}`}
                placeholder="Detalles adicionales..."
                value={newDetails}
                onChange={(e) => setNewDetails(e.target.value)}
                rows={2}
                className="w-full bg-[#0B132B] border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#00B4D8] focus:ring-1 focus:ring-[#00B4D8] resize-none"
              />
            </div>
            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                id={`btn-cancel-add-${column.id}`}
                onClick={() => {
                  setIsAddingTask(false);
                  setNewTitle('');
                  setNewDetails('');
                }}
                className="px-3 py-1 text-xs text-slate-400 hover:text-slate-200 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                id={`btn-submit-add-${column.id}`}
                className="px-3 py-1 bg-[#00B4D8] hover:bg-[#0077B6] text-slate-900 font-semibold text-xs rounded-lg transition-all shadow-md shadow-[#00B4D8]/20"
              >
                Guardar Tarea
              </button>
            </div>
          </form>
        ) : (
          <button
            type="button"
            id={`btn-open-add-task-${column.id}`}
            onClick={() => setIsAddingTask(true)}
            className="w-full py-2 px-3 flex items-center justify-center gap-2 border border-dashed border-slate-700 hover:border-[#00B4D8]/60 text-slate-400 hover:text-[#90E0EF] rounded-xl text-xs font-medium transition-all group hover:bg-[#0077B6]/10"
          >
            <svg className="w-4 h-4 text-slate-500 group-hover:text-[#00B4D8] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Nueva tarjeta
          </button>
        )}
      </div>
    </section>
  );
};

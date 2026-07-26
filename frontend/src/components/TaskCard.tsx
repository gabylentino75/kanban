'use client';

import React, { useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Task } from '../types/kanban';

interface TaskCardProps {
  task: Task;
  index: number;
  columnId: string;
  onDelete: (taskId: string, columnId: string) => void;
  onUpdate: (taskId: string, newTitle: string, newDetails: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  index,
  columnId,
  onDelete,
  onUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDetails, setEditDetails] = useState(task.details);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTitle.trim()) return;
    onUpdate(task.id, editTitle, editDetails);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(task.title);
    setEditDetails(task.details);
    setIsEditing(false);
  };

  return (
    <Draggable draggableId={task.id} index={index} isDragDisabled={isEditing}>
      {(provided, snapshot) => (
        <article
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          id={`task-card-${task.id}`}
          className={`group relative p-4 rounded-xl border transition-all duration-200 select-none ${
            snapshot.isDragging
              ? 'bg-[#1E293B] border-[#00B4D8] shadow-2xl shadow-[#00B4D8]/20 scale-105 z-50 ring-2 ring-[#00B4D8]'
              : 'bg-[#162032]/90 hover:bg-[#1C283F] border-slate-700/60 hover:border-[#0077B6]/80 shadow-md hover:shadow-lg'
          }`}
        >
          {isEditing ? (
            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label htmlFor={`input-edit-title-${task.id}`} className="block text-[10px] font-medium text-slate-400 mb-1">
                  Editar Titulo
                </label>
                <input
                  type="text"
                  id={`input-edit-title-${task.id}`}
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  required
                  autoFocus
                  className="w-full bg-[#0B132B] border border-[#00B4D8] rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#00B4D8]"
                />
              </div>

              <div>
                <label htmlFor={`input-edit-details-${task.id}`} className="block text-[10px] font-medium text-slate-400 mb-1">
                  Editar Detalles
                </label>
                <textarea
                  id={`input-edit-details-${task.id}`}
                  value={editDetails}
                  onChange={(e) => setEditDetails(e.target.value)}
                  rows={2}
                  className="w-full bg-[#0B132B] border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-[#00B4D8] resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  id={`btn-cancel-edit-${task.id}`}
                  onClick={handleCancel}
                  className="px-2.5 py-1 text-xs text-slate-400 hover:text-slate-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  id={`btn-save-edit-${task.id}`}
                  className="px-3 py-1 bg-[#00B4D8] hover:bg-[#0077B6] text-slate-900 font-semibold text-xs rounded-lg transition-all"
                >
                  Guardar
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="flex items-start justify-between gap-2">
                <h4
                  id={`task-title-${task.id}`}
                  className="font-semibold text-slate-100 text-sm leading-snug break-words flex-1 cursor-pointer hover:text-[#90E0EF] transition-colors"
                  onClick={() => setIsEditing(true)}
                >
                  {task.title}
                </h4>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    id={`btn-edit-task-${task.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsEditing(true);
                    }}
                    aria-label={`Editar tarea ${task.title}`}
                    className="opacity-60 hover:opacity-100 transition-opacity p-1 text-slate-400 hover:text-[#90E0EF] rounded-md hover:bg-slate-700/50"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>

                  <button
                    type="button"
                    id={`delete-task-${task.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(task.id, columnId);
                    }}
                    aria-label={`Eliminar tarea ${task.title}`}
                    className="opacity-60 hover:opacity-100 transition-opacity p-1 text-slate-400 hover:text-red-400 rounded-md hover:bg-red-500/10"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              {task.details && (
                <p
                  id={`task-details-${task.id}`}
                  className="mt-2 text-xs text-[#888888] leading-relaxed break-words line-clamp-3 cursor-pointer"
                  onClick={() => setIsEditing(true)}
                >
                  {task.details}
                </p>
              )}

              <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-700/40 text-[10px] text-slate-500">
                <span className="font-mono text-[#90E0EF]/60">{task.createdAt}</span>
                <span className="text-[#00B4D8]/80 text-[11px] font-medium tracking-wide">
                  Arrastrar
                </span>
              </div>
            </>
          )}
        </article>
      )}
    </Draggable>
  );
};

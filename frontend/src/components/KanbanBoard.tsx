'use client';

import React, { useEffect, useState } from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { useKanban } from '../hooks/useKanban';
import { Column } from './Column';

export const KanbanBoard: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const { boardState, moveTask, addTask, deleteTask, updateTask, renameColumn } = useKanban();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDragEnd = (result: DropResult) => {
    const { destination, source } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    moveTask(
      source.droppableId,
      destination.droppableId,
      source.index,
      destination.index
    );
  };

  if (!mounted) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-[#90E0EF] text-sm font-semibold tracking-wider">
          Cargando Tablero Kanban...
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 h-screen overflow-hidden">
      {/* Header Bar */}
      <header className="px-8 py-4 border-b border-slate-800/80 bg-[#0B132B]/80 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#03045E] via-[#0077B6] to-[#00B4D8] flex items-center justify-center shadow-lg shadow-[#0077B6]/20 ring-1 ring-white/10">
            <svg className="w-5 h-5 text-[#90E0EF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 01-2-2h-2a2 2 0 01-2 2" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-100">
              Tablero Kanban
            </h1>
            <p className="text-xs text-[#888888]">
              Gestion de tareas MVP - 5 Columnas
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#03045E]/80 text-[#90E0EF] border border-[#0077B6]/40">
            Tablero Unico
          </span>
        </div>
      </header>

      {/* Main Board Area */}
      <main id="kanban-main-board" className="flex-1 overflow-x-auto p-6 scrollbar-thin">
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex gap-5 min-w-max h-full pb-2">
            {boardState.columnOrder.map((colId) => {
              const column = boardState.columns[colId];
              const tasks = column.taskIds.map((taskId) => boardState.tasks[taskId]).filter(Boolean);

              return (
                <Column
                  key={column.id}
                  column={column}
                  tasks={tasks}
                  onAddTask={addTask}
                  onDeleteTask={deleteTask}
                  onUpdateTask={updateTask}
                  onRenameColumn={renameColumn}
                />
              );
            })}
          </div>
        </DragDropContext>
      </main>
    </div>
  );
};

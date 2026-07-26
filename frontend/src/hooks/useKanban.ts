import { useState } from 'react';
import { KanbanBoardState, Task } from '../types/kanban';

const INITIAL_STATE: KanbanBoardState = {
  tasks: {
    'task-1': {
      id: 'task-1',
      title: 'Disenar interfaz de usuario',
      details: 'Crear maquetas responsive aplicando el esquema de colores institucional.',
      createdAt: '2026-07-26',
    },
    'task-2': {
      id: 'task-2',
      title: 'Configurar estructura Next.js',
      details: 'Establecer App Router y la arquitectura de componentes en el subdirectorio frontend.',
      createdAt: '2026-07-26',
    },
    'task-3': {
      id: 'task-3',
      title: 'Integrar Drag and Drop',
      details: 'Implementar dnd-kit o hello-pangea para gestionar el movimiento entre columnas.',
      createdAt: '2026-07-26',
    },
    'task-4': {
      id: 'task-4',
      title: 'Pruebas de integracion Playwright',
      details: 'Crear casos de prueba para validar adición, eliminación y renombrado de columnas.',
      createdAt: '2026-07-26',
    },
    'task-5': {
      id: 'task-5',
      title: 'Optimizacion de rendimiento UI',
      details: 'Asegurar transiciones suaves y accesibilidad ARIA en cada tarjeta.',
      createdAt: '2026-07-26',
    },
  },
  columns: {
    'col-1': {
      id: 'col-1',
      title: 'Por Hacer',
      taskIds: ['task-1', 'task-2'],
    },
    'col-2': {
      id: 'col-2',
      title: 'En Planificacion',
      taskIds: ['task-3'],
    },
    'col-3': {
      id: 'col-3',
      title: 'En Desarrollo',
      taskIds: ['task-4'],
    },
    'col-4': {
      id: 'col-4',
      title: 'En Revision',
      taskIds: ['task-5'],
    },
    'col-5': {
      id: 'col-5',
      title: 'Completado',
      taskIds: [],
    },
  },
  columnOrder: ['col-1', 'col-2', 'col-3', 'col-4', 'col-5'],
};

export function useKanban() {
  const [boardState, setBoardState] = useState<KanbanBoardState>(INITIAL_STATE);

  const moveTask = (
    sourceColId: string,
    destColId: string,
    sourceIndex: number,
    destIndex: number
  ) => {
    setBoardState((prev) => {
      const sourceCol = prev.columns[sourceColId];
      const destCol = prev.columns[destColId];

      if (!sourceCol || !destCol) return prev;

      if (sourceColId === destColId) {
        const newTaskIds = Array.from(sourceCol.taskIds);
        const [moved] = newTaskIds.splice(sourceIndex, 1);
        newTaskIds.splice(destIndex, 0, moved);

        return {
          ...prev,
          columns: {
            ...prev.columns,
            [sourceColId]: {
              ...sourceCol,
              taskIds: newTaskIds,
            },
          },
        };
      }

      const sourceTaskIds = Array.from(sourceCol.taskIds);
      const [moved] = sourceTaskIds.splice(sourceIndex, 1);

      const destTaskIds = Array.from(destCol.taskIds);
      destTaskIds.splice(destIndex, 0, moved);

      return {
        ...prev,
        columns: {
          ...prev.columns,
          [sourceColId]: {
            ...sourceCol,
            taskIds: sourceTaskIds,
          },
          [destColId]: {
            ...destCol,
            taskIds: destTaskIds,
          },
        },
      };
    });
  };

  const addTask = (columnId: string, title: string, details: string) => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    const newTaskId = `task-${Date.now()}`;
    const newTask: Task = {
      id: newTaskId,
      title: trimmedTitle,
      details: details.trim(),
      createdAt: new Date().toISOString().split('T')[0],
    };

    setBoardState((prev) => {
      const column = prev.columns[columnId];
      if (!column) return prev;

      return {
        ...prev,
        tasks: {
          ...prev.tasks,
          [newTaskId]: newTask,
        },
        columns: {
          ...prev.columns,
          [columnId]: {
            ...column,
            taskIds: [newTaskId, ...column.taskIds],
          },
        },
      };
    });
  };

  const deleteTask = (taskId: string, columnId: string) => {
    setBoardState((prev) => {
      const column = prev.columns[columnId];
      if (!column) return prev;

      const newTasks = { ...prev.tasks };
      delete newTasks[taskId];

      return {
        ...prev,
        tasks: newTasks,
        columns: {
          ...prev.columns,
          [columnId]: {
            ...column,
            taskIds: column.taskIds.filter((id) => id !== taskId),
          },
        },
      };
    });
  };

  const renameColumn = (columnId: string, newTitle: string) => {
    const trimmed = newTitle.trim();
    if (!trimmed) return;

    setBoardState((prev) => {
      const column = prev.columns[columnId];
      if (!column) return prev;

      return {
        ...prev,
        columns: {
          ...prev.columns,
          [columnId]: {
            ...column,
            title: trimmed,
          },
        },
      };
    });
  };

  const updateTask = (taskId: string, title: string, details: string) => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    setBoardState((prev) => {
      const existing = prev.tasks[taskId];
      if (!existing) return prev;

      return {
        ...prev,
        tasks: {
          ...prev.tasks,
          [taskId]: {
            ...existing,
            title: trimmedTitle,
            details: details.trim(),
          },
        },
      };
    });
  };

  return {
    boardState,
    moveTask,
    addTask,
    deleteTask,
    updateTask,
    renameColumn,
  };
}

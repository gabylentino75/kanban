export interface Task {
  id: string;
  title: string;
  details: string;
  createdAt: string;
}

export interface ColumnData {
  id: string;
  title: string;
  taskIds: string[];
}

export interface KanbanBoardState {
  columns: Record<string, ColumnData>;
  columnOrder: string[];
  tasks: Record<string, Task>;
}

import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";

import type { Board, Task } from "../../types";
import { KanbanColumn } from "./KanbanColumn";
import { TaskCard } from "./TaskCard";
import { useMoveTask } from "../../hooks/useTasks";

interface KanbanBoardProps {
  board: Board;
  onAddTask: (columnId: string) => void;
  onTaskClick: (taskId: string) => void;
}

export const KanbanBoard = ({
  board,
  onAddTask,
  onTaskClick,
}: KanbanBoardProps) => {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const moveTask = useMoveTask();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = board.columns
      ?.flatMap((col) => col.tasks || [])
      .find((t) => t?.id === active.id);

    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveTask(null);
      return;
    }

    const taskId = active.id as string;
    const targetColumnId = over.id as string;

    // Find task and target column
    const task = board.columns
      ?.flatMap((col) => col.tasks || [])
      .find((t) => t?.id === taskId);
    const targetColumn = board.columns?.find(
      (col) => col.id === targetColumnId
    );

    if (!task || !targetColumn) {
      setActiveTask(null);
      return;
    }

    // If dropped in same column, no action needed (handled by sortable)
    if (task.columnId === targetColumnId) {
      setActiveTask(null);
      return;
    }

    // Move to new column
    const newPosition = targetColumn.tasks?.length || 0;

    moveTask.mutate({
      id: taskId,
      columnId: targetColumnId,
      position: newPosition,
    });

    setActiveTask(null);
  };

  const columns = board.columns || [];

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns
          .sort((a, b) => a.position - b.position)
          .map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              onAddTask={() => onAddTask(column.id)}
              onTaskClick={onTaskClick}
            />
          ))}

        {columns.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p>No columns found. Create a board first!</p>
          </div>
        )}
      </div>

      <DragOverlay>
        {activeTask && <TaskCard task={activeTask} onClick={() => {}} />}
      </DragOverlay>
    </DndContext>
  );
};

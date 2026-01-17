import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import type { Board, Task } from "../../types";
import { KanbanColumn } from "./KanbanColumn";
import { TaskCard } from "./TaskCard";
import { useMoveTask } from "../../hooks/useTasks";
import { Icon } from "@iconify/react";

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

    // If dropped in same column, no action needed
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
    <div className="h-full flex flex-col">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        {/* Kanban Board Container */}
        <div className="flex-1 overflow-x-auto overflow-y-hidden">
          <div className="flex gap-4 h-full px-2 py-2">
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

            {/* Add Column Button */}
            <div className="min-w-[280px] max-w-[280px]">
              <button 
                className="w-full p-4 rounded-2xl border-2 border-dashed text-gray-400 hover:text-green-600 hover:border-green-300 transition-all group"
                style={{
                  borderColor: 'rgba(209, 213, 219, 0.5)',
                  background: 'rgba(255, 255, 255, 0.3)'
                }}
              >
                <div className="flex flex-col items-center gap-2 py-8">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"
                    style={{
                      background: 'rgba(74, 222, 128, 0.1)'
                    }}
                  >
                    <Icon 
                      icon="mdi:plus" 
                      width={24}
                      className="text-gray-400 group-hover:text-green-600 transition-colors"
                    />
                  </div>
                  <span className="text-sm font-medium">Add Column</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Empty State */}
        {columns.length === 0 && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center max-w-md">
              <div 
                className="w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, rgba(74, 222, 128, 0.1) 0%, rgba(22, 163, 74, 0.05) 100%)'
                }}
              >
                <Icon 
                  icon="mdi:view-column-outline" 
                  width={40} 
                  className="text-gray-300"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                No columns yet
              </h3>
              <p className="text-gray-500 mb-6">
                Create your first column to start organizing tasks
              </p>
              <button className="btn-primary">
                <Icon icon="mdi:plus" width={20} className="inline mr-2" />
                Create Column
              </button>
            </div>
          </div>
        )}

        {/* Drag Overlay */}
        <DragOverlay>
          {activeTask && (
            <div className="rotate-3 scale-105">
              <TaskCard task={activeTask} onClick={() => {}} />
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
};
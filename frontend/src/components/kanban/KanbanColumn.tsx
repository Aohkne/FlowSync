import { Icon } from "@iconify/react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { Column } from "../../types";
import { TaskCard } from "./TaskCard";

interface KanbanColumnProps {
  column: Column;
  onAddTask: () => void;
  onTaskClick: (taskId: string) => void;
}

export const KanbanColumn = ({
  column,
  onAddTask,
  onTaskClick,
}: KanbanColumnProps) => {
  const { setNodeRef } = useDroppable({
    id: column.id,
  });

  const tasks = column.tasks || [];
  const taskIds = tasks.map((task) => task.id);

  return (
    <div className="bg-gray-100 rounded-lg p-4 min-w-[300px] max-w-[300px] flex flex-col">
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-gray-900">{column.title}</h3>
          <span className="bg-gray-200 text-gray-600 text-xs font-medium px-2 py-1 rounded-full">
            {tasks.length}
          </span>
        </div>

        <button
          onClick={onAddTask}
          className="text-gray-600 hover:text-gray-900 transition-colors"
          title="Add task"
        >
          <Icon icon="mdi:plus" width={20} />
        </button>
      </div>

      {/* Tasks Container */}
      <div ref={setNodeRef} className="flex-1 space-y-3 overflow-y-auto">
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onClick={() => onTaskClick(task.id)}
            />
          ))}
        </SortableContext>

        {tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center py-8 text-gray-400">
            <Icon icon="mdi:inbox" width={48} />
            <p className="text-sm mt-2">No tasks yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

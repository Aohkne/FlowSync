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
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  const tasks = column.tasks || [];
  const taskIds = tasks.map((task) => task.id);

  return (
    <div 
      className="flex flex-col min-w-[320px] max-w-[320px] h-full"
    >
      {/* Column Header - Glass Effect */}
      <div 
        className="glass-panel rounded-2xl p-4 mb-3 border"
        style={{
          borderColor: 'rgba(229, 231, 235, 0.5)',
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="w-2 h-8 rounded-full"
              style={{
                background: 'linear-gradient(180deg, #4ade80 0%, #22c55e 100%)',
                boxShadow: '0 0 10px rgba(34, 197, 94, 0.3)'
              }}
            />
            <div>
              <h3 className="font-bold text-gray-900 text-base">
                {column.title}
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
              </p>
            </div>
          </div>

          <button
            onClick={onAddTask}
            className="p-2 rounded-lg hover:bg-white/70 transition-all group"
            title="Add task"
            style={{
              background: 'rgba(255, 255, 255, 0.5)'
            }}
          >
            <Icon 
              icon="mdi:plus" 
              width={20} 
              className="text-gray-600 group-hover:text-green-600 group-hover:rotate-90 transition-all duration-300"
            />
          </button>
        </div>
      </div>

      {/* Tasks Container - Droppable Area */}
      <div
        ref={setNodeRef}
        className="flex-1 space-y-3 overflow-y-auto pr-1 pb-4 rounded-2xl transition-all duration-300"
        style={{
          minHeight: '200px',
          maxHeight: 'calc(100vh - 280px)',
          background: isOver ? 'rgba(74, 222, 128, 0.05)' : 'transparent',
          border: isOver ? '2px dashed #4ade80' : '2px dashed transparent',
          padding: isOver ? '12px' : '8px',
        }}
      >
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {tasks
            .sort((a, b) => a.position - b.position)
            .map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onClick={() => onTaskClick(task.id)}
              />
            ))}
        </SortableContext>

        {/* Empty State */}
        {tasks.length === 0 && (
          <div 
            className="flex flex-col items-center justify-center py-12 rounded-xl transition-all"
            style={{
              background: 'rgba(255, 255, 255, 0.4)',
              border: '2px dashed rgba(209, 213, 219, 0.5)'
            }}
          >
            <Icon 
              icon="mdi:inbox-outline" 
              width={48} 
              className="text-gray-300 mb-3"
            />
            <p className="text-sm text-gray-400 font-medium">No tasks yet</p>
            <button
              onClick={onAddTask}
              className="mt-3 text-xs text-green-600 hover:text-green-700 font-medium flex items-center gap-1 transition-colors"
            >
              <Icon icon="mdi:plus-circle-outline" width={16} />
              Add first task
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
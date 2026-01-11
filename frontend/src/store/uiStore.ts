import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

interface UIState {
  isSidebarOpen: boolean;
  activeModal: string | null;
  selectedTaskId: string | null;
}

interface UIActions {
  toggleSidebar: () => void;
  openModal: (modalName: string) => void;
  closeModal: () => void;
  setSelectedTask: (taskId: string | null) => void;
}

type UIStore = UIState & UIActions;

export const useUIStore = create<UIStore>()(
  immer((set) => ({
    // State
    isSidebarOpen: true,
    activeModal: null,
    selectedTaskId: null,

    // Actions
    toggleSidebar: () =>
      set((state) => {
        state.isSidebarOpen = !state.isSidebarOpen;
      }),

    openModal: (modalName) =>
      set((state) => {
        state.activeModal = modalName;
      }),

    closeModal: () =>
      set((state) => {
        state.activeModal = null;
      }),

    setSelectedTask: (taskId) =>
      set((state) => {
        state.selectedTaskId = taskId;
      }),
  }))
);

// Selectors
export const useActiveModal = () => useUIStore((state) => state.activeModal);
export const useSelectedTaskId = () =>
  useUIStore((state) => state.selectedTaskId);

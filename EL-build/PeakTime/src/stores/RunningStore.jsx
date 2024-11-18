import { create } from "zustand";
export const useRunningStore = create((set) => {
  return {
    running: false,
    runningActions: {
      setRunning: (value) => set(() => ({ running: value })),
    },
  };
});

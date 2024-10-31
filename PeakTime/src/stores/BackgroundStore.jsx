import { create } from "zustand";
export const useBackgroundStore = create((set) => {
  return {
    bg: "loft",
    bgActions: {
      setBackground: (bgInfo) => set((state) => ({ background: bgInfo })),
    },
  };
});

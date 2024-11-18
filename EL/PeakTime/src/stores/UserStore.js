import { create } from "zustand";
export const useUserStore = create((set) => {
  return {
    user: null,
    userActions: {
      setUser: (userInfo) => set(() => ({ user: userInfo })),
    },
  };
});

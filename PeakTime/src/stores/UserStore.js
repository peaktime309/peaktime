import { create } from "zustand";
export const useUserStore = create((set) => {
  return {
    user: null,
    userActions: {
      setuser: (userInfo) => set(() => ({ user: userInfo })),
    },
  };
});

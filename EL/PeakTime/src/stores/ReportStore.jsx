import { create } from "zustand";

const initialState = {
  selectedDay: null,

  hikingList: [],
  dailyHikingList: [],
};

export const useReportStore = create((set) => ({
  ...initialState,

  setSelectedDay: (day) => set({ selectedDay: day }),
  setSelectedDayCancel: () => set({ selectedDay: initialState.selectedDay }),

  setHikingList: (hikingList) => set({ hikingList: [...hikingList] }),
  setHikingListIfFail: () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const lastDay = new Date(year, month + 1, 0).getDate();

    const defaultHikingList = Array.from({ length: lastDay }, (_, idx) => ({
      date: new Date(year, month, idx + 1).toISOString().split("T")[0],
      totalMinute: 0,
    }));

    set({ hikingList: defaultHikingList });
  },
  setDailyHikingList: (dailyHikingList) =>
    set({ dailyHikingList: [...dailyHikingList] }),
  resetDailyHikingList: () =>
    set({ dailyHikingList: initialState.dailyHikingList }),

  resetAll: () => set({ ...initialState }),
}));

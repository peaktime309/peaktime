import { create } from "zustand";

const initialState = {};

export const useMemoStore = create((set) => ({
  ...initialState,
}));

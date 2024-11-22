import { create } from "zustand";

export const usePresetStore = create((set) => ({
  presetList: [],
  selectedPreset: null,
  setPresetList: (presets) => set({ presetList: presets }),
  selectPreset: (presetId) =>
    set((state) => ({
      selectedPreset: state.presetList.find(
        (preset) => preset.presetId === presetId
      ),
    })),
  deletePreset: (presetId) =>
    set((state) => ({
      presetList: state.presetList.filter(
        (preset) => preset.presetId !== presetId
      ),
    })),
  resetPreset: () => set({ presetList: [] }),
}));

export default usePresetStore;  

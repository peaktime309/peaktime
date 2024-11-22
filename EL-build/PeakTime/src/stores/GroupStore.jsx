import { create } from "zustand";

const initialState = {
  groupList: [],
  presetList: [],

  groupId: null,

  childId: null,
  showNow: null,
}

export const useGroupStore = create((set) => ({
  ...initialState,

  setGroupList: (groups) => set({ groupList: groups }),
  setPresetList: (presets) => set({ presetList: presets }),
  setGroupId: (groupId) => set({ groupId: groupId }),
  setChildId: (childId) => set({ childId: childId }),

  // "addChild", "updateChild", "addGroup", "updateGroup", null만 허용
  // 이외의 값이 들어온 경우 상태를 변경하지 않음
  // 값을 null로 변경하는 것은 창을 닫는 것을 의미함
  setShowNow: (value) => 
    set((state) => {
      if (["addChild", "updateChild", "addGroup", "updateGroup", null].includes(value)) {
        return { showNow: value };
      }
      return state;
    }),

  // 창 변경
  setContent: (content, id = null) => {
    useGroupStore.getState().setShowNow(content);
    if (content === "updateGroup") {
      useGroupStore.getState().setGroupId(id);
    } else if (content === "updateChild") {
      useGroupStore.getState().setChildId(id);
    } else return;
  },

  getGroupById: (groupId) => {
    const { groupList } = useGroupStore.getState();
    return groupList.find((group) => group.groupId === groupId) || null;
  },

  getPresetById: (presetId) => {
    const { presetList } = useGroupStore.getState();
    return presetList.find((preset) => preset.presetId === presetId) || null;
  },

  resetGroupList: () => set({ groupList: [] }),
  resetGroupId: () => set({ groupId: null }),
  resetChildId: () => set({ childId: null }),

  resetAll: () => set({ ...initialState }),
}));
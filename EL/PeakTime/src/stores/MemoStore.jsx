import { create } from "zustand";

const initialState = {
  // 메모
  memoList: [],
  memoData: {
    title: "",
    content: "",
    createdAt: "",
  },
  memoPage: 0,
  isMemoLastPage: false,
  selectedMemo: null,

  // 요약
  summaryList: [],
  summaryData: {
    summaryId: null,
    content: "",
    updatedAt: "",
  },
  summaryPage: 0,
  isSummaryLastPage: false,
  selectedSummary: null,

  // 요약 입력 등
  summaryCount: 0,

  inputTitle: "", // prompt title
  inputText: "", // prompt text
  keywords: [],
  keywordInput: "",

  isLoading: false, // summary 중 LoadingSpinner
};

export const useMemoStore = create((set) => ({
  ...initialState,

  activeTab: "memo",
  summaryCountLimit: 3, // 요약 최대한도 수
  inputTitleLimit: 15,
  inputTextLimit: 1000,
  keywordInputLimit: 10, // 키워드 하나당 최대 글자 길이
  keywordsLimit: 3, // 최대 키워드 input 수

  setActiveTab: (value) => set({ activeTab: value }),
  setMemoList: (addMemoList, newIsLastPage) => {
    const isLastPage = useMemoStore.getState().isMemoLastPage;

    if (isLastPage) return;

    set((state) => ({
      memoList: [...state.memoList, ...addMemoList],
      memoPage: !isLastPage ? state.memoPage + 1 : state.memoPage,
      isMemoLastPage: newIsLastPage,
    }));
  },
  setSummaryList: (addSummaryList, newIsLastPage) => {
    const isLastPage = useMemoStore.getState().isSummaryLastPage;

    if (isLastPage) return;

    set((state) => ({
      summaryList: [...state.summaryList, ...addSummaryList],
      summaryPage: !isLastPage ? state.summaryPage + 1 : state.summaryPage,
      isSummaryLastPage: newIsLastPage,
    }));
  },
  setSummaryCount: (count) => set({ summaryCount: count }),
  setMemoData: (memoData) => set({ memoData: memoData }),
  setSummaryData: (summaryData) => set({ summaryData: summaryData }),

  setSelectedMemo: (selectedMemo) => set({ selectedMemo: selectedMemo }),
  setSelectedSummary: (selectedSummary) =>
    set({ selectedSummary: selectedSummary }),

  setInputTitle: (text) => set({ inputTitle: text }),
  setInputText: (text) => set({ inputText: text }),
  setKeywords: (keywords) => set({ keywords: [...keywords] }),
  setKeywordInput: (keyword) => set({ keywordInput: keyword }),

  setIsLoading: (bool) => set({ isLoading: bool }),

  resetMemoContent: () =>
    set((state) => ({
      ...state,
      memoList: initialState.memoList,
      memoData: initialState.memoData,
      selectedMemo: initialState.selectedMemo,
      memoPage: initialState.memoPage,
      isMemoLastPage: initialState.isMemoLastPage,
    })),
  resetSummaryContent: () =>
    set((state) => ({
      ...state,
      summaryList: initialState.summaryList,
      summaryData: initialState.summaryData,
      selectedSummary: initialState.selectedSummary,
      summaryPage: initialState.summaryPage,
      isSummaryLastPage: initialState.isSummaryLastPage,
    })),
  resetInputTitle: () => set({ inputTitle: initialState.inputTitle }),
  resetInputText: () => set({ inputText: initialState.inputText }),
  resetKeyWords: () => set({ keywords: initialState.keywords }),
  resetSummaryData: () => set({ summaryData: initialState.summaryData }),
  resetAll: () => set({ ...initialState }),
}));

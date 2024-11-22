import { create } from "zustand";

const initialState = {
  rawdata: {
    root: {
      userId: 0,
      nickname: "",
      totalHikingTime: 0,
      totalHikingCount: 0,
      totalSuccessCount: 0,
      totalBlockedCount: 0,
      startTimeList: [],
      mostSiteList: [],
      mostProgramList: [],
    },
    groupList: [
      {
        groupId: 0,
        groupTitle: "",
        childList: [],
      },
    ],
  },

  isRoot: JSON.parse(localStorage.getItem("user"))?.isRoot || false,

  showStatistics: {
    userId: null,
    nickname: null,
    totalHikingTime: 0,
    totalHikingCount: 0,
    totalSuccessCount: 0,
    totalBlockedCount: 0,
    startTimeList: [],
    mostSiteList: [],
    mostProgramList: [],
  },
  childList: [],

  groupId: null, // selected
  childUserId: null, // selected
};

export const useStatisticsStore = create((set) => ({
  ...initialState,

  setRawdata: (rawdata) => set({ rawdata: rawdata }),

  // 드롭다운 child 목록
  setChildList: (groupId) => {
    const group = useStatisticsStore
      .getState()
      .rawdata.groupList.find((group) => group.groupId === groupId);

    set({ childList: group?.childList || [] });
  },

  // 드롭다운에서 선택한 group 및 sub user
  setGroupId: (groupId) => set({ groupId: groupId }),
  setChildUserId: (childUserId) => set({ childUserId: childUserId }),

  // 통계 페이지에 보일 유저의 groupId, childUserId 세팅
  setUser: (groupId = null, childUserId = null) => {
    useStatisticsStore.getState().setGroupId(groupId);
    useStatisticsStore.getState().setChildUserId(childUserId);
  },

  // 통계 페이지 화면에 보일 통계 데이터
  setShowStatistics: (groupId = null, childUserId = null) => {
    const { rawdata } = useStatisticsStore.getState();
    const selectedKeys = [
      "userId",
      "nickname",
      "totalHikingTime",
      "totalHikingCount",
      "totalSuccessCount",
      "totalBlockedCount",
      "startTimeList",
      "mostSiteList",
      "mostProgramList",
    ];

    let newStatistics;

    // root user인 경우 groupId, childUserId 모두 null
    // sub user인 경우 groupId, childUserId 모두 값이 있어야 함
    if (groupId === null && childUserId === null) {
      newStatistics = Object.keys(rawdata.root)
        .filter((key) => selectedKeys.includes(key))
        .reduce((obj, key) => {
          obj[key] = rawdata.root[key];
          return obj;
        }, {});
    } else if (groupId !== null && childUserId !== null) {
      const group = rawdata.groupList.find(
        (group) => group.groupId === groupId
      );

      if (!group) {
        newStatistics = initialState.showStatistics;
      } else {
        const child = group.childList.find(
          (childInfo) => childInfo.userId === childUserId
        );
        newStatistics = child || initialState.showStatistics;
      }
    }

    set({ showStatistics: newStatistics });
  },

  resetAll: () => set({ ...initialState }),
}));

// import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Title from "../components/common/Title";
import hikingsApi from "../api/hikingsApi";
import StatisticsReport from "../components/Statistics/StatisticsReport";
import { useStatisticsStore } from "../stores/StatisticsStore";
import { HiOutlinePresentationChartLine } from "react-icons/hi2";

function StatisticPage() {
  const {
    rawdata,
    isRoot,
    showStatistics,
    childList,
    groupId,
    childUserId,
    setRawdata,
    setChildList,
    setGroupId,
    setChildUserId,
    setUser,
    setShowStatistics,
    resetAll,
  } = useStatisticsStore();

  const handleChangeGroupId = (newGroupId) => {
    if (newGroupId === "") {
      setUser();
      return;
    }

    setUser(Number(newGroupId), null);
    setChildList(Number(newGroupId));
  };

  const handleChangeChildUserId = (newChildId) => {
    if (newChildId === "") {
      setChildUserId(null);
      return;
    }

    setChildUserId(Number(newChildId));
  };

  useEffect(() => {
    // 통계 조회
    hikingsApi
      .get("/statistics")
      .then((res) => {
        setRawdata(res.data.data);
      })
      .then(() => {
        setShowStatistics();
      })
      .catch();

    return () => {
      resetAll();
    };
  }, []);

  useEffect(() => {
    // groupId, childUserId가 둘 다 null이거나 둘 다 null이 아닐 때만 실행
    if ((groupId === null) === (childUserId === null)) {
      setShowStatistics(groupId, childUserId);
    }
  }, [groupId, childUserId, setShowStatistics]);

  return (
    <div className="h-[100vh] flex flex-col">
      <div className="left-[11vw] flex flex-col w-full h-full">
        <Title title={"통계"} />
        {/* <button onClick={goBack}>돌아가기</button> */}

        <div className="absolute bg-[#333333] bg-opacity-70 left-[11vw] top-[10vh] w-[86vw] h-[84vh] my-[3vh] rounded-lg flex flex-col p-5 text-white">
          {/* header 부분 */}
          <div className="grid grid-cols-3 items-center pb-3 mb-3 border-b">
            {/* 왼쪽 아이콘 */}
            <div className="text-[60px] font-bold flex justify-start">
              <HiOutlinePresentationChartLine />
            </div>

            {/* 가운데 제목 */}
            <div className="text-center text-[40px] font-bold">
              {showStatistics.nickname} 의 통계
            </div>

            {/* 오른쪽 드롭다운 (root 사용자일 때만 표시) */}
            {isRoot && (
              <div className="flex justify-end space-x-3">
                <select
                  id="groupId"
                  name="groupId"
                  value={groupId}
                  onChange={(e) => handleChangeGroupId(e.target.value)}
                  className="w-[250px] p-2 bg-gray-800 text-white rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-[#03C777]"
                >
                  <option value="">{rawdata?.root?.nickname}</option>
                  <option disabled>그룹을 선택해주세요.</option>
                  {rawdata?.groupList?.map((group) => (
                    <option key={group.groupId} value={group.groupId}>
                      {group.groupTitle}
                    </option>
                  ))}
                </select>

                <select
                  id="subUserId"
                  name="subUserId"
                  value={childUserId}
                  onChange={(e) => handleChangeChildUserId(e.target.value)}
                  className="w-[250px] p-2 bg-gray-800 text-white rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-[#03C777]"
                  disabled={!groupId || childList?.length === 0}
                >
                  {groupId !== "" ? (
                    groupId && childList?.length > 0 ? (
                      <>
                        <option value="">유저를 선택해주세요.</option>

                        {childList.map((user) => (
                          <option key={user.userId} value={user.userId}>
                            {user.nickname}
                          </option>
                        ))}
                      </>
                    ) : (
                      <option value="">등록된 유저가 없습니다.</option>
                    )
                  ) : (
                    <option value="">그룹을 선택해주세요.</option>
                  )}
                </select>
              </div>
            )}
          </div>

          {/* 통계 */}
          <StatisticsReport />
        </div>
      </div>
    </div>
  );
}

export default StatisticPage;

import { useEffect, useState } from "react";
import { useGroupStore } from "../../stores/GroupStore";
import { SlArrowDown, SlArrowUp } from "react-icons/sl";
import "../../styles/custom-scrollbar.css";

function ChildList() {
  const { groupList, setContent } = useGroupStore();
  const [isChildListShow, setIsChildListShow] = useState({});

  // 그룹 목록 변경 시 상태 동기화
  useEffect(() => {
    const initialState = {};
    groupList.forEach((group) => {
      initialState[group.groupId] = false; // 초기값은 모두 닫힌 상태
    });
    setIsChildListShow(initialState);
  }, [groupList]);

  const toggleShow = (groupId) => {
    setIsChildListShow((prev) => ({
      ...prev,
      [groupId]: !prev[groupId], // 해당 그룹의 상태만 토글
    }));
  };

  return (
    <div className="absolute bg-[#333333] bg-opacity-70 left-[11vw] w-[29vw] h-[84vh] my-[3vh] rounded-lg flex flex-col justify-start items-center text-start p-5">
      <h2 className="self-start mb-3 text-white font-bold text-[30px]">
        그룹 목록({groupList?.length} / 5)
      </h2>
      <p className="text-gray-400 text-[18px] absolute right-5 top-5">
        *설정할 그룹이나 유저의 이름을 눌러주세요
      </p>
      <div className="flex flex-col gap-5 bg-white text-[20px] w-[25vw] h-[70vh] overflow-y-auto rounded-lg p-5 custom-scrollbar" style={{ scrollbarGutter: "stable", }}>
        {groupList.map((group, groupIdx) => (
          <div key={group.groupId} className="flex flex-col gap-3">
            <button
              className="flex justify-between mx-2 text-left font-bold" 
              onClick={() => { 
                setContent("updateGroup", group.groupId);
                toggleShow(group.groupId);
              }}
            >
              <div className="text-left truncate w-full">
                {group.groupTitle} ({group.childList.length} / 30)
              </div>
              <>{isChildListShow[group.groupId] ? <SlArrowUp /> : <SlArrowDown />}</>
            </button>

            {isChildListShow[group.groupId] && 
              group.childList.map((child, childIdx) => (
                <div
                  key={child.userId}
                  className="flex items-center ml-4 text-[18px] w-full"
                >
                  <button
                    onClick={() => setContent("updateChild", child.userId)}
                    className="text-left w-full"
                  >
                    └ {child.nickname}
                  </button>
                </div>
              ))
            }

          </div>
        ))}
      </div>
      <div className="self-start mt-3">
        {groupList.length < 5 ? (
          <>
            <button
              onClick={() => setContent("addGroup")}
              className="text-white font-bold text-[20px]"
            >
              +그룹 추가
            </button>
            <span className="px-4" />
          </>
        ) : null}
        <button
          onClick={() => setContent("addChild")}
          className="text-white font-bold text-[20px]"
        >
          +계정 추가
        </button>
      </div>
    </div>
  );
}

export default ChildList;

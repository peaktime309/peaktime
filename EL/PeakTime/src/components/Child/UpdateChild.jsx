import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import ChangePassword from "./ChangePassword";
import groupsApi from "../../api/groupsApi";
import childrenApi from "../../api/childrenApi";
import { useGroupStore } from "../../stores/GroupStore";
import { updateChildAlertMessage } from "../../utils/Child/UpdateChildAlertMessage";
import { deleteChildAlertMessage } from "../../utils/Child/DeleteChildAlertMessage";
import { IoIosArrowDown } from "react-icons/io";
import "../../styles/daily-report-custom-swal.css";

function UpdateChild() {
  const FAIL_TO_GET_GROUPLIST = {
    title: "그룹 전체 조회 실패",
    text: "그룹 전체 정보를 조회하는 데 실패했습니다. 잠시 후 다시 시도해주세요.",
    icon: "error",
    confirmButtonText: "확인",
    confirmButtonColor: "#03C777",
    customClass: {
      popup: "custom-swal-popup",
    },
  };

  const {
    groupList,
    groupId,
    childId,
    setGroupList,
    setGroupId,
    setContent,
    getGroupById,
  } = useGroupStore();

  // groupList에서 child 찾아 변수로 지정
  const [child, setChild] = useState(null);

  // 화면 최상단에 표시될 닉네임
  const [childNickname, setChildNickname] = useState(null);

  // 드롭다운 관련
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  // 서브유저 닉네임 및 그룹 조회
  useEffect(() => {
    for (const group of groupList) {
      const child = group.childList.find((child) => child.userId === childId);
      if (child) {
        setChild(child);
        setGroupId(group.groupId);
        setChildNickname(child.nickname);
        setSelectedOption(getGroupById(group.groupId));
        break;
      }
    }
  }, [childId, groupList]);

  // 계정 삭제 모달
  const openDeleteModal = () => {
    Swal.fire(deleteChildAlertMessage("check")).then((res) => {
      // 확인 누르면 삭제, 취소 누르면 모달 닫히고 아무것도 실행하지 않음
      if (!res.isConfirmed) return;

      childrenApi
        .delete(`/${childId}`)
        .then(() => {
          Swal.fire(deleteChildAlertMessage("success"));

          groupsApi
            .get("")
            .then((result) => {
              setGroupList(result.data.data.groupList);
              setContent(null);
            })
            .catch(() => Swal.fire(FAIL_TO_GET_GROUPLIST));
        })
        .catch((error) => {
          Swal.fire(deleteChildAlertMessage("fail", error));
        });
    });
  };

  // 계정 수정 (적용하기 클릭)
  const handleUpdateChildInfo = () => {
    childrenApi
      .put(`/${childId}`, { groupId, childNickName: child.nickname })
      .then(() => {
        Swal.fire(updateChildAlertMessage());

        groupsApi
          .get("")
          .then((result) => setGroupList(result.data.data.groupList))
          .catch(() => Swal.fire(FAIL_TO_GET_GROUPLIST));
      })
      .catch((error) => Swal.fire(updateChildAlertMessage(error)));
  };

  const handleChange = (content, item) => {
    switch (content) {
      case "childNickname":
        setChild((prevChild) => ({ ...prevChild, nickname: item }));
        return;
      case "groupId":
        setGroupId(item);
        return;
      default:
        return null;
    }
  };

  const handleinitassword = () => {
    childrenApi
      .put(`/${childId}/init-password`)
      .then(() => {
        Swal.fire({
          title: "비밀번호 초기화 성공",
          text: `초기화 비밀번호는 000000 입니다.`,
          icon: "success",
          confirmButtonText: "확인",
          confirmButtonColor: "#03C777",
          customClass: {
            popup: "custom-swal-popup",
          },
        });
      })
      .catch(() =>
        Swal.fire({
          title: "비밀번호 초기화 실패",
          text: "비밀번호 초기화을 실패했습니다. 잠시 후 다시 시도해주세요.",
          icon: "error",
          confirmButtonText: "확인",
          confirmButtonColor: "#03C777",
          customClass: {
            popup: "custom-swal-popup",
          },
        })
      );
  };

  return (
    <div className="absolute left-[43vw] w-[54vw] h-[84vh] my-[3vh] bg-[#333333] bg-opacity-70 rounded-lg p-5 flex flex-col items-center justify-between">
      <h2 className="w-full text-white text-[30px] font-bold pb-3 border-b">
        {childNickname} ({child?.userLoginId})
      </h2>

      <div className="flex flex-col gap-3 justify-between w-[70%]">
        <div className="flex flex-col gap-3 text-start w-[40%]">
          <label htmlFor="" className="text-white font-bold text-[22px]">
            아이디
          </label>
          <input
            id="userLoginId"
            name="userLoginId"
            value={child?.userLoginId || ""}
            disabled
            className="px-3 py-3 h-[60%] rounded-lg ps-3 bg-opacity-90 text-white font-bold"
          />
        </div>
      </div>
      <div className="flex flex-col gap-3 justify-between w-[70%]">
        <div className="flex justify-between w-full">
          <div className="flex flex-col gap-3 text-start w-[40%]">
            <label htmlFor="" className="text-white font-bold text-[22px]">
              닉네임
            </label>
            <input
              id="childNickname"
              name="childNickname"
              value={child?.nickname || ""}
              onChange={(e) => handleChange("childNickname", e.target.value)}
              className="h-[60%] rounded-lg focus:ring-4 focus:ring-[#66aadf] focus:outline-none ps-3"
            />
          </div>
          <div className="flex flex-col gap-3 text-start w-[40%]">
            <label
              htmlFor="groupId"
              className="text-white font-bold text-[22px]"
            >
              소속 그룹
            </label>
            <div
              tabIndex={0}
              onChange={(e) => setGroupId(e.target.value)}
              className={`relative h-[60%] rounded-lg bg-white border border-gray-300 px-3 py-2 cursor-pointer ${
                isOpen ? "focus:ring-4 focus:ring-[#66aadf]" : ""
              }`}
            >
              <div
                onClick={() => setIsOpen(!isOpen)}
                className="flex justify-between items-center"
              >
                <p>
                  {selectedOption
                    ? selectedOption.groupTitle
                    : "그룹을 선택해주세요"}
                </p>
                <IoIosArrowDown />
              </div>
              {isOpen && (
                <ul
                  className="absolute left-0 right-0 mt-3 bg-white border
                border-gray-300 rounded-lg shadow-lg z-50"
                >
                  {groupList.map((group, index) => (
                    <div key={group.groupId}>
                      <li
                        onClick={() => {
                          setGroupId(group.groupId);
                          setSelectedOption(group);
                          setIsOpen(false);
                        }}
                        className="px-3 py-2 hover:bg-[#66aadf] cursor-pointer rounded-lg hover:font-bold"
                      >
                        {`${group.groupTitle} (${group.childList.length} / 30)`}
                      </li>
                      {index < groupList.length - 1 && (
                        <hr className="border-gray-200" />
                      )}
                    </div>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-3 justify-between w-[70%] relative">
        <button
          onClick={handleinitassword}
          className="bg-[#66aadf] rounded-xl px-5 py-2 hover:bg-[#4d90d8] focus:ring-4 focus:ring-[#66aadf] font-bold"
        >
          비밀번호 초기화
        </button>
      </div>
      <div className="w-full flex justify-end gap-5">
        <button
          onClick={() => openDeleteModal()}
          className="bg-[#f40000] rounded-xl px-5 py-2 hover:bg-[#d60000] focus:ring-4 focus:ring-[#f40000] text-white font-bold"
        >
          계정삭제
        </button>
        <button
          onClick={handleUpdateChildInfo}
          className="bg-[#03c777] rounded-xl px-5 py-2 hover:bg-[#02a566] focus:ring-4 focus:ring-[#03c777] text-white font-bold"
        >
          적용하기
        </button>
        <button
          onClick={() => setContent(null)}
          className="bg-[#7c7c7c] rounded-xl px-5 py-2 hover:bg-[#5c5c5c] focus:ring-4 focus:ring-[#c5c5c5] text-white font-bold"
        >
          닫기
        </button>
      </div>
    </div>
  );
}

export default UpdateChild;

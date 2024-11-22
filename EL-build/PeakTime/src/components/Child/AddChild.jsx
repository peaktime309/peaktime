import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import authApi from "../../api/authApi";
import groupsApi from "../../api/groupsApi";
import childrenApi from "../../api/childrenApi";
import { useGroupStore } from "../../stores/GroupStore";
import {
  errorToCheckIsIdDuplicated,
  errorBeforeConfirm,
  addChildAlertMessage,
} from "../../utils/Child/AddChildAlertMessage";
import { IoIosArrowDown } from "react-icons/io";

function AddChild() {
  const { groupList, setGroupList, setContent } = useGroupStore();
  const [groupId, setGroupId] = useState("");
  // 서브 계정 아이디 관련
  const [childLoginId, setChildLoginId] = useState("");
  const [idFormatIsOK, setIdFormatIsOK] = useState(false);
  const [isDuplicate, setIsDuplicate] = useState(false); // false, "duplicated", "checked, "needToCheck"
  // 비밀번호 관련

  // 닉네임 관련
  const [childNickname, setChildNickname] = useState("");

  // 드롭다운 관련
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const resetAllInputs = () => {
    setGroupId("");
    setChildLoginId("");
    setChildNickname("");
    setIsDuplicate(false);
    setSelectedOption(null);
  };

  const duplicatedMessage = () => {
    if (!idFormatIsOK)
      return (
        <div className="text-[#f40000]" style={{ whiteSpace: "pre-wrap" }}>
          {`* 5자 이상 15자 이하\n* 영문, 숫자 사용 가능`}
        </div>
      );

    switch (isDuplicate) {
      case "duplicated":
        return (
          <div className="text-[#f40000]" style={{ whiteSpace: "pre-wrap" }}>
            {`입력한 아이디는 이미 존재합니다.\n `}
          </div>
        );
      case "checked":
        return (
          <div
            className="text-[#03c777]"
            style={{ whiteSpace: "pre-wrap" }}
          >{`사용 가능한 아이디입니다.\n `}</div>
        );
      case "needToCheck":
        return (
          <div className="text-[#f40000]" style={{ whiteSpace: "pre-wrap" }}>
            {`아이디 중복 확인이 필요합니다.\n `}
          </div>
        );
      default:
        return;
    }
  };

  // 아이디 형식 확인
  useEffect(() => {
    const idRegex = /^[a-zA-Z0-9]{5,15}$/;
    if (idRegex.test(childLoginId)) {
      setIdFormatIsOK(true);
    } else {
      setIdFormatIsOK(false);
    }
    setIsDuplicate("needToCheck");
  }, [childLoginId]);

  // 아이디 중복 확인
  const handleCheckId = () => {
    authApi
      .get(`/user-login-id`, { params: { userLoginId: childLoginId } })
      .then((result) => {
        if (result.data.data.isDuplicated === true) {
          setIsDuplicate("duplicated");
        } else {
          setIsDuplicate("checked");
        }
      })
      .catch(() => Swal.fire(errorToCheckIsIdDuplicated));
  };

  // 생성하기 클릭
  const handleConfirm = () => {
    if (isDuplicate === false || isDuplicate === "needToCheck") {
      setIsDuplicate("needToCheck");
      return false;
    }

    if (
      isDuplicate !== "checked" ||
      !groupId ||
      !childLoginId ||
      !childNickname
    ) {
      Swal.fire(errorBeforeConfirm);
      return false;
    }

    childrenApi
      .post("", {
        groupId,
        childLoginId,
        childNickname,
      })
      .then(() => {
        resetAllInputs();
        Swal.fire(addChildAlertMessage()).then(() => {
          groupsApi
            .get("")
            .then((result) => setGroupList(result.data.data.groupList))
            .catch();
        });
      })
      .catch((err) => {
        Swal.fire(addChildAlertMessage(err));
      });
  };

  // 닉네임 확인 후 메시지
  const nicknameMessage = () => {
    const nicknameRegex = /^[가-힣a-zA-Z0-9]{2,15}$/;

    if (nicknameRegex.test(childNickname)) {
      return (
        <div className="text-[#03C777] top-[105%]">
          사용 가능한 닉네임입니다.
        </div>
      );
    }

    return (
      <div
        className="text-[#f40000] top-[105%]"
        style={{ whiteSpace: "pre-line" }}
      >
        {`* 2자 이상 15자 이하 \n* 한글, 영문, 숫자 사용 가능`}
      </div>
    );
  };

  return (
    <div className="absolute left-[43vw] w-[54vw] h-[84vh] my-[3vh] bg-[#333333] bg-opacity-70 rounded-lg p-5 flex flex-col items-center justify-between">
      <h2 className="text-white text-[30px] font-bold">계정 생성</h2>

      {/* 닉네임, 소속 그룹 */}
      <div className="flex justify-around w-[70%] h-[10vh] text-left">
        <div className="flex flex-col gap-3 w-[40%]">
          <label
            htmlFor="childNickname"
            className="text-white font-bold text-[22px]"
          >
            닉네임
          </label>
          <input
            id="childNickname"
            name="childNickname"
            placeholder="닉네임"
            value={childNickname}
            onChange={(e) => setChildNickname(e.target.value)}
            className="rounded-lg focus:ring-4 focus:ring-[#66aadf] focus:outline-none px-3 py-2"
          />
          {nicknameMessage()}
        </div>
        <div className="flex flex-col gap-3 w-[40%]">
          <label htmlFor="groupId" className="text-white font-bold text-[22px]">
            소속 그룹
          </label>
          <div
            tabIndex={0}
            onChange={(e) => setGroupId(e.target.value)}
            className={`relative rounded-lg bg-white border border-gray-300 px-3 py-2 cursor-pointer ${
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
                  : "그룹을 선택하세요."}
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
          {groupId == "" ? (
            <div className="text-[#f40000] top-[105%]">
              * 소속 그룹을 선택해주세요
            </div>
          ) : null}
        </div>
      </div>

      {/* 아이디 */}
      <div className="flex flex-col justify-between w-[70%]">
        <div className="flex justify-around gap-3 text-start w-full">
          <div className="flex flex-col gap-3 w-[40%]">
            <label
              htmlFor="childLoginId"
              className="text-white font-bold text-[22px]"
            >
              아이디
            </label>
            <input
              id="childLoginId"
              name="childLoginId"
              placeholder="로그인 아이디"
              value={childLoginId}
              onChange={(e) => {
                setChildLoginId(e.target.value);
                setIsDuplicate("needToCheck");
              }}
              className="rounded-lg focus:ring-4 focus:ring-[#66aadf] focus:outline-none px-3 py-2"
            />
            {duplicatedMessage()}
          </div>
          <div
            className="gap-3 w-[40%] text-[#FFFFFF] text-[#7C7C7C] text-[18px] font-bold flex justify-center items-center"
            style={{ whiteSpace: "pre-line" }}
          >
            <>
              {`* 서브 계정 생성 시 초기 비밀번호는 000000 입니다,\n\n* 서브 계정 로그인 후 비밀번호를 변경할 수 있습니다.`}
            </>
          </div>
        </div>

        <div className="w-full flex justify-around">
          <div className="w-[40%] flex">
            {isDuplicate !== "checked" ? (
              <button
                onClick={() => handleCheckId()}
                className="font-bold text-white bg-[#4d90d8] rounded-xl px-5 py-2 mt-3 hover:bg-[#3476d0] focus:ring-4 focus:ring-[#4d90d8]"
                disabled={!idFormatIsOK}
              >
                아이디 중복 확인
              </button>
            ) : (
              <button
                className="font-bold text-white bg-transparent rounded-xl px-5 py-2 mt-3 invisible"
                disabled
              >
                아이디 중복 확인
              </button>
            )}
          </div>
          <div className="w-[40%]" />
        </div>
        <div />
      </div>

      <div className="w-full flex justify-end gap-5">
        <button
          onClick={() => handleConfirm()}
          className="bg-[#03c777] rounded-xl px-5 py-2 hover:bg-[#02a566] focus:ring-4 focus:ring-[#03c777] text-white font-bold"
        >
          생성하기
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

export default AddChild;

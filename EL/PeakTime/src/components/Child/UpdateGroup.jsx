import { useEffect, useState } from "react";
import groupsApi from "../../api/groupsApi";
import timersApi from "../../api/timersApi";
import AddGroupTimer from "./AddGroupTimer";
import Swal from "sweetalert2";
import { useGroupStore } from "../../stores/GroupStore";
import ReactDOM from "react-dom/client";
import { UPDATE_GROUP_ALERT_MESSAGE } from "../../utils/Child/UpdateGroupAlertMessage";
import { IoIosArrowDown } from "react-icons/io";
import "../../styles/daily-report-custom-swal.css";
import "../../styles/custom-scrollbar.css";

function UpdateGroup() {
  const { groupId, presetList, setGroupList, setContent, getPresetById } =
    useGroupStore();

  const [groupTitle, setGroupTitle] = useState(null);
  const [groupInfo, setGroupInfo] = useState(null);

  // 드롭다운 관련
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    // 그룹 단일 조회 API 호출
    if (!groupId) return;

    groupsApi
      .get(`/${groupId}`)
      .then((result) => {
        const data = result.data.data;

        setGroupInfo(data);
        setGroupTitle(data.title);
        setSelectedOption(getPresetById(data.presetId));
      })
      .catch(() => Swal.fire(UPDATE_GROUP_ALERT_MESSAGE.failToGetGroupInfo));
  }, [groupId]);

  // datetime을 time으로 변환하는 함수
  const timeOnly = (dateTimeString, attentionTime = null) => {
    const date = new Date(dateTimeString);

    if (attentionTime) {
      date.setMinutes(date.getMinutes() + attentionTime);
    }

    return date.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    });
  };

  // 비트마스킹된 repeat_day를 요일로 변환하는 함수
  const convertBitmaskToDays = (bitmask) => {
    if (!bitmask) return;

    const days = ["월", "화", "수", "목", "금", "토", "일"];
    const selectedDays = [];

    days.forEach((day, idx) => {
      if (bitmask & (1 << (6 - idx))) {
        selectedDays.push(day);
      }
    });

    return selectedDays.join(", ");
  };

  const handleChangeTitle = (e) => {
    setGroupInfo((prevGroupInfo) => ({
      ...prevGroupInfo,
      title: e.target.value,
    }));
  };

  const handleChangePresetId = (presetId) => {
    setGroupInfo((prevGroupInfo) => ({
      ...prevGroupInfo,
      presetId: presetId,
    }));
  };

  // 타이머 삭제
  const deleteTimer = (timerId) => {
    Swal.fire(UPDATE_GROUP_ALERT_MESSAGE.warningForDeleteTimer).then((res) => {
      if (!res.isConfirmed) return;

      timersApi
        .delete(`/${timerId}`)
        .then((result) => {
          setGroupInfo(result.data.data);
        })
        .catch(() => {
          Swal.fire(UPDATE_GROUP_ALERT_MESSAGE.failToDeleteTimer);
        });
    });
  };

  // 그룹 타이머 추가 모달
  const openTimeSetModal = () => {
    let root;
    let timerSetting = {};

    Swal.fire({
      title: "그룹 타이머 추가",
      html: `<div id="add-group-timer" />`,
      width: "40%",
      heightAuto: false,
      willOpen: () => {
        root = ReactDOM.createRoot(document.getElementById("add-group-timer"));

        const onSave = (saveFunction) => {
          timerSetting = saveFunction();
        };

        root.render(<AddGroupTimer onSave={onSave} />);
      },
      preConfirm: () => {
        if (
          timerSetting.attentionTime < 30 ||
          timerSetting.attentionTime > 240
        ) {
          // attentionTime이 30분에서 240분 사이가 아니라면 경고 모달 띄우고 false 반환
          Swal.fire(UPDATE_GROUP_ALERT_MESSAGE.attentionTimeOutOfRangeError);
          return false;
        } else if (timerSetting.repeatDay <= 0) {
          // 요일을 선택하지 않았다면 경고 모달 띄우고 false 반환
          Swal.fire(UPDATE_GROUP_ALERT_MESSAGE.notSelectedRepeatDayError);
          return false;
        }

        timersApi
          .post("", timerSetting)
          .then((result) => {
            Swal.fire(UPDATE_GROUP_ALERT_MESSAGE.successToCreateGroupTimer);
            setGroupInfo(result.data.data);
            return true;
          })
          .catch((error) => {
            if (error.response && error.response.status === 409) {
              Swal.fire(UPDATE_GROUP_ALERT_MESSAGE.duplicateGroupTimerError);
            } else {
              Swal.fire(UPDATE_GROUP_ALERT_MESSAGE.failToCreateGroupTime);
            }
            return false;
          });
      },
      didClose: () => {
        if (root) {
          root.unmount();
        }
      },
      confirmButtonColor: "#03C777",
      confirmButtonText: "저장",
      showDenyButton: true,
      denyButtonColor: "#F40000",
      denyButtonText: "취소",
      customClass: {
        popup: "custom-swal-popup",
      },
    });
  };

  // 그룹 삭제 모달
  const openDeleteModal = () => {
    Swal.fire(UPDATE_GROUP_ALERT_MESSAGE.warningForDeleteGroup).then((res) => {
      if (!res.isConfirmed) return;

      groupsApi
        .delete(`/${groupId}`)
        .then((result) => {
          // 삭제 완료 모달 띄운 후 그룹 목록 수정하고 페이지 닫기
          Swal.fire(UPDATE_GROUP_ALERT_MESSAGE.succcessToDeleteGroup).then(
            () => {
              setGroupList(result.data.data.groupList);
              setContent(null);
            }
          );
        })
        .catch(() => {
          Swal.fire(UPDATE_GROUP_ALERT_MESSAGE.failToDeleteGroup);
        });
    });
  };

  // 적용하기(그룹 수정) 클릭
  const openUpdateModal = () => {
    if (groupInfo.title.length > 32) {
      Swal.fire(UPDATE_GROUP_ALERT_MESSAGE.groupTitleLengthExceeded);
      return false;
    }

    Swal.fire(UPDATE_GROUP_ALERT_MESSAGE.warningForUpdateGroupInfo).then(
      (res) => {
        if (!res.isConfirmed) return false;

        groupsApi
          .put(`/${groupId}`, {
            title: groupInfo.title,
            presetId: groupInfo.presetId,
          })
          .then((result) => {
            Swal.fire(UPDATE_GROUP_ALERT_MESSAGE.successToUpdateGroup).then(
              () => {
                setGroupTitle(groupInfo.title);
                setGroupList(result.data.data.groupList);
              }
            );
          })
          .catch((err) => {
            err.status == 422
              ? Swal.fire(UPDATE_GROUP_ALERT_MESSAGE.duplicateGroupTitleError)
              : Swal.fire(UPDATE_GROUP_ALERT_MESSAGE.failToUpdateGroup);
          });
      }
    );
  };

  return (
    <div className="absolute left-[43vw] w-[54vw] h-[84vh] my-[3vh] bg-[#333333] bg-opacity-70 rounded-lg p-5 flex flex-col items-center justify-between">
      {/* title */}
      <h2 className="text-white text-[30px] font-bold w-full pb-3 border-b">
        {groupTitle}
      </h2>

      {/* title, presets */}
      <div className="flex justify-between w-[70%]">
        {/* title */}
        <div className="flex flex-col gap-3 text-start w-[40%]">
          <label className="text-white font-bold text-[22px]">그룹명</label>
          <input
            id="title"
            name="title"
            value={groupInfo?.title || ""}
            onChange={handleChangeTitle}
            className="h-[60%] rounded-lg focus:ring-4 focus:ring-[#66aadf] focus:outline-none ps-3"
          />
        </div>

        {/* presets */}
        <div className="flex flex-col gap-3 text-start w-[40%]">
          <label className="text-white font-bold text-[22px]">프리셋</label>
          <div
            tabIndex={0}
            className={`relative h-[60%] rounded-lg bg-white border border-gray-300 px-3 py-2 cursor-pointer ${
              isOpen ? "focus:ring-4 focus:ring-[#66aadf]" : ""
            }`}
          >
            <div
              onClick={() => setIsOpen(!isOpen)}
              className="flex justify-between items-center"
            >
              <p>
                {selectedOption ? selectedOption.title : "프리셋을 선택하세요."}
              </p>
              <IoIosArrowDown />
            </div>
            {isOpen && (
              <ul
                className="absolute left-0 right-0 mt-3 bg-white border
                  border-gray-300 rounded-lg shadow-lg"
              >
                {presetList.map((preset, index) => (
                  <div key={preset.presetId}>
                    <li
                      onClick={() => {
                        handleChangePresetId(preset.presetId);
                        setSelectedOption(preset);
                        setIsOpen(false);
                      }}
                      className="px-3 py-2 hover:bg-[#66aadf] cursor-pointer rounded-lg hover:font-bold"
                    >
                      {preset.title}
                    </li>
                    {index < presetList.length - 1 && (
                      <hr className="border-gray-200" />
                    )}
                  </div>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* timers */}
      <div className="w-[85%] h-[50%] text-start">
        <div className="w-full h-[90%] rounded-xl border-4 border-[#66aadf] p-5 overflow-y-auto custom-scrollbar">
          {groupInfo?.timerList.map((timer) => (
            <div
              key={timer.timerId}
              value={timer.timerId}
              className="flex justify-between p-2 mb-3 text-[18px] text-white bg-[#1d1d1d] rounded-xl"
            >
              <span>
                {timeOnly(timer.startTime)} ~{" "}
                {timeOnly(timer.startTime, timer.attentionTime)}
              </span>
              <span>{convertBitmaskToDays(timer.repeatDay)}</span>
              <button
                onClick={() => deleteTimer(timer.timerId)}
                className="font-bold text-[#f40000] pe-2"
              >
                X
              </button>
            </div>
          )) || ""}
        </div>
        <div className="mt-3 flex justify-between">
          <button
            onClick={() => openTimeSetModal()}
            className="text-white font-bold text-[20px] ps-3"
          >
            +시간 추가
          </button>
          <div className="text-gray-400 text-[18px] px-3">
            * 타이머는 설정된 요일과 시각에 매주 반복 실행됩니다.
          </div>
        </div>
      </div>

      <div className="w-full flex justify-end gap-5">
        <button
          onClick={() => openDeleteModal()}
          className="bg-[#f40000] rounded-xl px-5 py-2 hover:bg-[#d60000] focus:ring-4 focus:ring-[#f40000] text-white font-bold"
        >
          그룹삭제
        </button>
        <button
          onClick={() => openUpdateModal()}
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

export default UpdateGroup;

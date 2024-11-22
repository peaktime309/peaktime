import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { TiDelete } from "react-icons/ti";
import presetsApi from "../../api/presetsApi";
import Swal from "sweetalert2";
import ReactDOM from "react-dom/client";
import usePresetStore from "../../stores/PresetStore";
import AddSite from "./AddSite";
import AddProgram from "./AddProgram";
import "../../styles/daily-report-custom-swal.css";
import "../../styles/custom-scrollbar.css";
import chromeIcon from "../../assets/chrome.svg";
import icon from "../../assets/logo-16x16.png";

function PresetSetting({ onCancel, setUpdateTrigger }) {
  const { selectedPreset, presetList } = usePresetStore();
  const [title, setTitle] = useState(selectedPreset.title);

  // 받아온 array []형태로 처리해주기
  const [blockWebsiteArray, setBlockWebsiteArray] = useState([
    ...(selectedPreset.blockWebsiteArray || []),
  ]);
  const [blockProgramArray, setBlockProgramArray] = useState([
    ...(selectedPreset.blockProgramArray || []),
  ]);

  useEffect(() => {
    setTitle(selectedPreset.title);
    setBlockWebsiteArray([...(selectedPreset.blockWebsiteArray || [])]);
    setBlockProgramArray([...(selectedPreset.blockProgramArray || [])]);
  }, [selectedPreset]);

  // 프리셋 아이디로 정보조회해야함
  // 취소버튼 클릭
  const handleCancel = () => {
    onCancel();
  };

  // 사이트, 프로그램 한 줄 삭제 처리(따로 모달 처리 x)
  const handleDeleteSite = (idx) => {
    const updateWebsiteArray = blockWebsiteArray.filter((one, i) => i !== idx);
    console.log("Updated website Array:", updateWebsiteArray); // 상태가 업데이트되는지 확인
    setBlockWebsiteArray([...updateWebsiteArray]);
  };
  const handleDeleteProgram = (idx) => {
    const updateProgramArray = blockProgramArray.filter((one, i) => i !== idx);
    console.log("Updated program Array:", updateProgramArray); // 상태가 업데이트되는지 확인
    setBlockProgramArray([...updateProgramArray]);
  };

  // 사이트, 프로그램 한 줄 추가 처리
  const openAddSiteModal = () => {
    let root;
    let newSite;

    Swal.fire({
      title: "사이트 추가",
      html: `
        <div id="add-site" />
      `,
      width: "40%",
      willOpen: () => {
        root = ReactDOM.createRoot(document.getElementById("add-site"));
        const onAddSite = (value, isDisabled) => {
          newSite = value;
          Swal.getConfirmButton().disabled = isDisabled;
        };
        root.render(
          <AddSite
            blockWebsiteArray={blockWebsiteArray}
            onAddSite={onAddSite}
          />
        );
      },
      preConfirm: () => {
        handleAddSite(newSite);
      },
      didClose: () => {
        if (root) {
          root.unmount();
        }
      },
      showCancelButton: true,
      confirmButtonText: "저장하기",
      confirmButtonColor: "#66AADF",
      cancelButtonText: "취소",
      cancelButtonColor: "#F40000",
      customClass: {
        popup: "custom-swal-popup",
      },
    });
  };

  const openAddProgramModal = () => {
    let root;
    let newProgram;

    Swal.fire({
      title: "프로그램 추가",
      html: `
        <div id="add-program" />
      `,
      width: "40%",
      willOpen: () => {
        root = ReactDOM.createRoot(document.getElementById("add-program"));
        const onAddProgram = (value, isDisabled) => {
          newProgram = value;
          Swal.getConfirmButton().disabled = isDisabled;
        };
        root.render(
          <AddProgram
            blockProgramArray={blockProgramArray}
            onAddProgram={onAddProgram}
          />
        );
      },
      preConfirm: () => {
        handleAddProgram(newProgram);
      },
      didClose: () => {
        if (root) {
          root.unmount();
        }
      },
      showCancelButton: true,
      confirmButtonText: "저장하기",
      confirmButtonColor: "#66AADF",
      cancelButtonText: "취소",
      cancelButtonColor: "#F40000",
      customClass: {
        popup: "custom-swal-popup",
      },
    });
  };

  const handleAddSite = (url) => {
    setBlockWebsiteArray([...blockWebsiteArray, url]);
  };
  const handleAddProgram = (programName) => {
    setBlockProgramArray([...blockProgramArray, programName]);
  };

  // 수정하기 클릭 시 값 변경시키기(전체 조회는 이후 또 진행되어서 상관없음)
  const updatePresetPut = async () => {
    // 프리셋명 길이 확인
    if (title.length < 2 || title.length > 8) {
      Swal.fire({
        icon: "error",
        title: "프리셋명 양식 오류",
        text: "프리셋명은 2자 이상 8자 이하여야 합니다.",
        confirmButtonColor: "#03C777",
        confirmButtonText: "확인",
        customClass: {
          popup: "custom-swal-popup",
        },
      });
      return false;
    }

    // 프리셋명 중복 확인
    if (
      presetList.some(
        (p) => p.presetId !== selectedPreset.presetId && p.title === title
      )
    ) {
      Swal.fire({
        icon: "error",
        title: "프리셋명 중복 오류",
        text: "중복된 프리셋명을 가진 프리셋이 있습니다.",
        confirmButtonColor: "#03C777",
        confirmButtonText: "확인",
        customClass: {
          popup: "custom-swal-popup",
        },
      });
      return false;
    }

    try {
      // 프리셋 생성 Post 요청을 보내기
      // Request Body 데이터 가공
      const requestData = {
        title: title,
        blockWebsiteList: blockWebsiteArray,
        blockProgramList: blockProgramArray,
      };
      const response = await presetsApi.put(
        `/${selectedPreset.presetId}`,
        requestData
      );
      console.log("presetUpdatePutApi: ", response.data);
      // 업데이트 후 트리거 변경
      setUpdateTrigger((prev) => !prev); // 상태 변화시키기
      handleCancel(); // 수정 완료 후 닫기
    } catch (error) {
      console.error("Error post Preset:", error);
      throw error;
    }
  };

  const handleUpdatePreset = () => {
    updatePresetPut();
  };

  return (
    <div className="absolute left-[43vw] w-[54vw] h-[84vh] my-[3vh] bg-[#333333] bg-opacity-70 rounded-lg p-5 flex flex-col items-center justify-between text-white">
      <h2 className="text-[30px] font-bold w-full pb-3 border-b">
        {selectedPreset.title}
      </h2>

      <div className="flex flex-col gap-3 text-start">
        <label className="text-[22px] text-white font-bold">프리셋명</label>
        <input
          type="text"
          value={title}
          className="rounded-lg text-black focus:ring-4 focus:ring-[#66aadf] focus:outline-none ps-3"
          onChange={(event) => setTitle(event.target.value)}
        />
      </div>

      <div className="grid gap-5 grid-cols-2 w-full">
        <div>
          <div className="flex justify-center mb-4">
            <img src={chromeIcon} className="mr-[0.5vw]" />
            <h3 className="text-[22px] font-bold">사이트 차단 목록</h3>
          </div>
          <div className="h-[40vh] overflow-y-scroll border-2 border-[#66aadf] p-3 custom-scrollbar">
            {blockWebsiteArray.map((site, idx) => (
              <li key={idx} className="flex items-center text-[20px] gap-3">
                <div className="text-left truncate w-full">{site}</div>
                <button
                  className="text-[20px]"
                  onClick={() => handleDeleteSite(idx)}
                >
                  <TiDelete />
                </button>
              </li>
            ))}
          </div>
          <div className="w-full flex justify-start mt-3">
            <button
              className="text-white font-bold text-[20px]"
              onClick={openAddSiteModal}
            >
              +사이트 추가
            </button>
          </div>
        </div>
        <div>
          <div className="flex justify-center items-center mb-4">
            <img src={icon} className="mr-[0.5vw] w-[1.5em] h-[1.5em]" />
            <h3 className="text-[22px] font-bold">프로그램 차단 목록</h3>
          </div>
          <div className="h-[40vh] overflow-y-scroll border-2 border-[#66aadf] p-3 custom-scrollbar">
            {blockProgramArray.map((program, idx) => (
              <li key={idx} className="flex items-center text-[20px] gap-3">
                <span className="text-left truncate w-full">{program}</span>
                <button
                  className="text-[20px]"
                  onClick={() => handleDeleteProgram(idx)}
                >
                  <TiDelete />
                </button>
              </li>
            ))}
          </div>
          <div className="w-full flex justify-start mt-3">
            <button
              className="text-white font-bold text-[20px]"
              onClick={openAddProgramModal}
            >
              +프로그램 추가
            </button>
          </div>
        </div>
      </div>

      <div className="w-full flex justify-end items-end gap-5">
        <p className="text-gray-400 text-[18px] right-5 top-5">
          *수정 사항은 수정하기 버튼을 눌러야 최종 반영됩니다
        </p>
        <button
          className="bg-[#03c777] rounded-xl px-5 py-2 hover:bg-[#02a566] focus:ring-4 focus:ring-[#03c777] text-white font-bold"
          onClick={handleUpdatePreset}
        >
          수정하기
        </button>
        <button
          className="bg-[#7c7c7c] rounded-xl px-5 py-2 hover:bg-[#5c5c5c] focus:ring-4 focus:ring-[#c5c5c5] text-white font-bold"
          onClick={handleCancel}
        >
          닫기
        </button>
      </div>
    </div>
  );
}
// props validation 추가
PresetSetting.propTypes = {
  onCancel: PropTypes.func.isRequired,
  setUpdateTrigger: PropTypes.func.isRequired,
};
export default PresetSetting;

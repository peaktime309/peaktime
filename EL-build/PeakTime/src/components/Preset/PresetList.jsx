import { useEffect } from "react";
import Swal from "sweetalert2";
import PropTypes from "prop-types";
import presetsApi from "../../api/presetsApi";
import ReactDOM from "react-dom/client";
import { FaTrashAlt } from "react-icons/fa";
import AddPreset from "./AddPreset";
import usePresetStore from "../../stores/PresetStore";
import "../../styles/daily-report-custom-swal.css";
import "../../styles/custom-scrollbar.css";

function PresetList({ onPresetClick, updateTrigger }) {
  // 프리셋 리스트 api 요청 필요

  // 선택한 프리셋의 정보를 setting에 보내주기
  const { presetList, setPresetList, selectPreset, deletePreset } =
    usePresetStore();

  useEffect(() => {
    // 컴포넌트 마운트 시 전체 조회를 수행하여 초기 데이터를 설정
    fetchGetPresets();
  }, [updateTrigger]);

  const fetchGetPresets = async () => {
    try {
      // 프리셋 전체 조회 GET 요청을 보내기
      const response = await presetsApi.get(``);
      console.log("presetGetApi: ", response.data);

      const presetList = response.data.data.presetList;
      setPresetList([...presetList]); // 상태를 업데이트하여 UI에 반영
      return response;
    } catch (error) {
      console.error("Error fetching:", error);
      throw error;
    }
  };

  const makePresetPost = async (title) => {
    try {
      // 프리셋 생성 Post 요청을 보내기
      // Request Body 데이터 가공
      const requestData = {
        title,
        blockWebsiteList: [],
        blockProgramList: [],
      };
      const response = await presetsApi.post(``, requestData);
      console.log("presetPostApi: ", response.data);
      // setPresetList((presetList) => [...presetList, requestData]); // 상태를 업데이트하여 UI에 반영

      // 생성 후 목록 조회
      if (response.data.status === 200) {
        fetchGetPresets();
      }
    } catch (error) {
      console.error("Error post Preset:", error);
      throw error;
    }
  };

  const makePresetDelete = async (presetId) => {
    try {
      // 프리셋 delete 요청을 보내기
      console.log("delete 프리셋 아이디 ", presetId);
      const response = await presetsApi.delete(`/${presetId}`);
      console.log("presetDeleteApi: ", response.data);
      handleDelete(presetId); //
    } catch (error) {
      console.error("Error delete Preset:", error);
      throw error;
    }
  };

  // 삭제 버튼 클릭
  const openDeleteWarn = (title, presetId) => {
    Swal.fire({
      title: "차단 프리셋 삭제",
      text: `선택한 프리셋을 삭제하시겠습니까?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "확인",
      confirmButtonColor: "#03C777",
      cancelButtonText: "취소",
      cancelButtonColor: "#F40000",
      customClass: {
        popup: "custom-swal-popup",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        makePresetDelete(presetId);
      }
    });
  };

  // 프리셋 클릭
  const handleClickSetting = (preset) => {
    onPresetClick(preset); // preset을 띄워주세요
  };

  // 추가버튼 클릭 api 요청 추가
  const handleAddBtn = () => {
    if (presetList.length >= 5) {
      Swal.fire({
        title: "프리셋은 최대 5개까지 생성이 가능합니다.",
        icon: "error",
        confirmButtonText: "확인",
        confirmButtonColor: "green",
      });

      return false;
    }

    let root;
    let title = "";

    Swal.fire({
      title: "차단 프리셋 추가",
      html: `<div id="add-preset" />`,
      width: "30%",
      heightAuto: false,
      willOpen: () => {
        root = ReactDOM.createRoot(document.getElementById("add-preset"));
        const onSave = (value, isDuplicated) => {
          title = value;
          Swal.getConfirmButton().disabled = isDuplicated;
        };
        root.render(<AddPreset onSave={onSave} />);
      },
      preConfirm: () => {
        makePresetPost(title).then(() => {
          fetchGetPresets();
        });
      },
      didClose: () => {
        if (root) {
          root.unmount();
        }
      },
      confirmButtonColor: "#03C777",
      confirmButtonText: "생성",
      showCancelButton: true,
      cancelButtonColor: "#F40000",
      cancelButtonText: "취소",
      customClass: {
        popup: "custom-swal-popup",
      },
    });
  };

  // 삭제버튼 클릭
  const handleDelete = (presetId) => {
    deletePreset(presetId);
    selectPreset(null);
  };

  return (
    <div className="absolute bg-[#333333] bg-opacity-70 left-[11vw] w-[29vw] h-[84vh] my-[3vh] rounded-lg flex flex-col justify-start items-center text-start p-5">
      <h2 className="self-start text-white font-bold text-[30px] mb-3">
        차단 프리셋 목록({presetList.length} / 5)
      </h2>

      <div className="flex flex-col gap-5 bg-white text-[20px] w-[25vw] h-[70vh] overflow-y-auto rounded-lg custom-scrollbar p-5">
        {presetList.map((preset, index) => (
          <div
            className={`gap-5 flex justify-between pb-4 ${
              index !== presetList.length - 1 ? "border-b" : ""
            }`}
            key={index}
          >
            <button onClick={() => handleClickSetting(preset)}>
              <div className="flex flex-col w-full text-start">
                <div className="font-bold">{preset.title}</div>
                <div className="text-[18px]" style={{ whiteSpace: "pre-line" }}>
                  {`└ 차단 관리되는 사이트: ${preset.blockWebsiteArray.length}개
                  └ 차단 관리되는 프로그램: ${preset.blockProgramArray.length}개`}
                </div>
              </div>
            </button>
            <button
              className="text-[25px]"
              onClick={() => openDeleteWarn(preset.title, preset.presetId)}
            >
              <FaTrashAlt />
            </button>
          </div>
        ))}
      </div>

      <div className="self-start mt-3">
        {presetList.length < 5 ? (
          <button
            className="text-white font-bold text-[20px]"
            onClick={handleAddBtn}
          >
            +차단 프리셋 추가
          </button>
        ) : null}
      </div>
    </div>
  );
}
// props validation 추가
PresetList.propTypes = {
  onPresetClick: PropTypes.func.isRequired,
  updateTrigger: PropTypes.func.isRequired,
};
export default PresetList;

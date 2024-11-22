import Swal from "sweetalert2";
import dayjs from "dayjs";
import memosApi from "../../api/memosApi";
import { useEffect, useState } from "react";
import { useMemoStore } from "../../stores/MemoStore";
import "../../styles/daily-report-custom-swal.css";
import "../../styles/custom-scrollbar.css";

function MemoDetail() {
  const {
    memoData,
    setMemoData,
    selectedMemo,
    setSelectedMemo,
    inputText,
    setInputText,
    inputTextLimit,
  } = useMemoStore();

  const [selectedText, setSelectedText] = useState(""); // 드래그 텍스트 저장

  // 생성날짜 바로 보이게 처리
  const formatDate = (date) => {
    return dayjs(date).format("YY.MM.DD HH:mm:ss");
  };

  // 특정 메모 정보 보기
  const readDetailMemoGet = async () => {
    try {
      // 메모 상세정보 get api
      const response = await memosApi.get(`/${selectedMemo}`);
      console.log("get detail memo api: ", response.data);

      setMemoData({
        title: response.data.data.title,
        content: response.data.data.memoContent,
        createdAt: response.data.data.memoCreateAt,
      });
    } catch (error) {
      console.error("Error get detail memo api", error);
      Swal.fire({
        title: "메모 조회 실패",
        customClass: {
          popup: "custom-swal-popup",
        },
        text: "메모 조회 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
        icon: "error",
        confirmButtonText: "확인",
        confirmButtonColor: "#7C7C7C",
      });
      throw error;
    }
  };

  // MemoList에서 클릭 시 메모 상세조회 실행
  useEffect(() => {
    readDetailMemoGet();
  }, [selectedMemo]);

  const handleSelection = () => {
    const selected = window.getSelection().toString();
    if (selected) {
      setSelectedText(selected);
    }
  };

  // 복사하기
  const copyButton = () => {
    const newTextLength = inputText.length + selectedText.trim().length; // inputTextLimit 검증
    if (newTextLength > inputTextLimit) {
      Swal.fire({
        title: "글자 수 초과",
        customClass: {
          popup: "custom-swal-popup",
        },
        text: `복사한 텍스트를 추가하면 ${inputTextLimit}자를 초과합니다.`,
        icon: "error",
        confirmButtonText: "확인",
      }).then(() => {
        setSelectedText("");
        window.getSelection().removeAllRanges();
      }); // 드래그 선택 취소

      return;
    }

    if (selectedText.trim() !== "") {
      // 기존 텍스트가 비어있지 않을때만 줄바꿈해서 넣어주기
      setInputText(inputText ? inputText + "\n" + selectedText : selectedText);
      Swal.fire({
        title: "복사 완료",
        customClass: {
          popup: "custom-swal-popup",
        },
        text: "선택한 텍스트가 입력란에 복사되었습니다.",
        icon: "success",
        confirmButtonText: "확인",
      }).then(() => {
        setSelectedText("");
        window.getSelection().removeAllRanges(); // 드래그 선택 취소
      });
    } else {
      Swal.fire({
        title: "텍스트 선택 필요",
        customClass: {
          popup: "custom-swal-popup",
        },
        text: "먼저 메모 내용에서 텍스트를 선택하세요.",
        icon: "warning",
        confirmButtonText: "확인",
      });
    }
  };

  return (
    <div className="absolute left-[42.5vw] my-[3vh] gap-x-[2vw] flex">
      <>
        {selectedMemo && (
          <div className="w-[28vw] h-[84vh] bg-[#333333] bg-opacity-70 rounded-lg p-5 flex flex-col items-center justify-between">
            <h2 className="w-full text-white text-[30px] font-bold pb-3 border-b mb-5">
              {memoData.title}
            </h2>

            <div className="flex flex-col justify-between h-full w-full gap-x-5 px-3">
              <div className="flex w-full justify-between mb-3">
                <h2 className="text-white text-[20px] font-bold">메모 정보</h2>
                <div className="text-white">
                  메모 일자: {formatDate(memoData.createdAt)}
                </div>
              </div>

              <div className="h-full flex flex-col justify-between">
                <div
                  style={{ whiteSpace: "pre-line" }}
                  className="min-h-[60vh] max-h-[60vh] text-left overflow-y-scroll p-3 bg-white custom-scrollbar mb-5"
                  onMouseUp={(event) => {
                    event.stopPropagation(); // 이벤트 전파 막기
                    handleSelection();
                  }}
                >
                  {memoData.content}
                </div>

                <div className="flex justify-end gap-x-5 mb-3">
                  <button
                    onClick={() => copyButton()}
                    className="bg-[#03c777] rounded-xl px-5 py-2 hover:bg-[#02a566] focus:ring-4 focus:ring-[#03c777] text-white font-bold"
                  >
                    복사하기
                  </button>
                  <button
                    className="text-white font-bold px-5 py-2 rounded-xl bg-[#7C7C7C] hover:bg-[#5C5C5C]"
                    onClick={() => setSelectedMemo(null)}
                  >
                    닫기
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    </div>
  );
}

export default MemoDetail;

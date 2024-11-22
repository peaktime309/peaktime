import Swal from "sweetalert2";
import summariesApi from "../../api/summariesApi";
import { TiDelete } from "react-icons/ti";
import { useMemoStore } from "../../stores/MemoStore";
import { useState } from "react";

function MemoDetailPrompt() {
  const {
    inputTitle,
    inputTitleLimit,
    setInputTitle,
    inputText,
    setInputText,
    inputTextLimit,
    keywordInput,
    setKeywordInput,
    keywordInputLimit,
    keywords,
    keywordsLimit,
    setKeywords,
    memoData,
    summaryList,
    setSummaryList,
    summaryPage,
    isSummaryLastPage,
    summaryCount,
    setSummaryCount,
    summaryCountLimit,
    setIsLoading,
    resetInputTitle,
    resetInputText,
    resetKeyWords,
    resetSummaryContent,
  } = useMemoStore();

  const [isFetching, setIsFetching] = useState(false);

  // 키워드 입력 핸들러
  const handleKeywordInputChange = (event) => {
    setKeywordInput(event.target.value);
  };

  const handleInputTitleChange = (event) => {
    const text = event.target.value;
    setInputTitle(text);
  };

  const handleInputChange = (event) => {
    const text = event.target.value;
    if (text.length > inputTextLimit) {
      Swal.fire({
        title: "글자 수 초과",
        customClass: {
          popup: "custom-swal-popup",
        },
        text: `최대 ${inputTextLimit}자까지만 입력할 수 있습니다.`,
        icon: "warning",
        confirmButtonColor: "#03C777",
        confirmButtonText: "확인",
      });
      return;
    }
    setInputText(text);
  };

  const fetchGetSummaryList = async () => {
    if (isFetching) return;

    setIsFetching(true);

    try {
      // 요약 리스트 전체 조회 GET 요청을 보내기
      const response = await summariesApi.get(``, {
        params: { page: 0 },
      });
      console.log("summariesGetApi: ", response.data);

      const data = response.data.data;
      const addSummaryList = data.summaryList;
      const isLastPage = data.isLastPage;

      setSummaryList(addSummaryList, isLastPage); // 상태를 업데이트하여 UI에 반영
    } catch (error) {
      console.error("Error fetching summaryList:", error);
      throw error;
    } finally {
      setIsFetching(false);
    }
  }; // setsummarycount 제외

  // 키워드 추가 함수
  const addKeyword = () => {
    if (keywordInput.length > keywordInputLimit) {
      Swal.fire({
        title: "키워드 글자 수 초과",
        customClass: {
          popup: "custom-swal-popup",
        },
        text: `키워드 글자 수는 최대 ${keywordInputLimit}자까지만 입력할 수 있습니다.`,
        icon: "warning",
        confirmButtonColor: "#03C777",
        confirmButtonText: "확인",
      });
      return;
    }
    // 추가 키워드의 개수는 최대 세 개
    if (keywords.length >= keywordsLimit) {
      Swal.fire({
        title: "추가 키워드 초과",
        customClass: {
          popup: "custom-swal-popup",
        },
        text: `키워드는 최대 ${keywordsLimit}개까지 추가할 수 있습니다.`,
        icon: "warning",
        confirmButtonColor: "#03C777",
        confirmButtonText: "확인",
      });
      return;
    }
    // 중복 검증 및 빈 단어 x 검증
    if (keywordInput.trim() === "" || keywords.includes(keywordInput.trim())) {
      Swal.fire({
        title: "중복 또는 빈 키워드",
        customClass: {
          popup: "custom-swal-popup",
        },
        text: "이미 추가된 키워드거나 비어있는 키워드입니다. 다른 키워드를 입력해주세요.",
        icon: "warning",
        confirmButtonColor: "#03C777",
        confirmButtonText: "확인",
      });
      return;
    }

    setKeywords([...keywords, keywordInput.trim()]);
    setKeywordInput(""); // 입력 필드 초기화
  };

  const removeKeyword = (keyword) => {
    setKeywords(keywords.filter((item) => item !== keyword));
  };

  // 요약하기 모달 띄우기
  // 사이트, 프로그램 한 줄 추가 처리
  const openSummaryModal = (title, keywords) => {
    Swal.fire({
      title: `📝 ${title} 요약하기`,
      customClass: {
        popup: "custom-swal-popup",
      },
      html: `추가 키워드: ${keywords.join(
        ", "
      )}<br><br>해당 내용으로 요약을 진행하시겠습니까?`,
      showCancelButton: true,
      confirmButtonText: "요약하기",
      confirmButtonColor: "#03C777",
      cancelButtonText: "취소",
      cancelButtonColor: "#F40000",
    }).then((result) => {
      if (result.isConfirmed) {
        // 조건 검사를 먼저 수행
        handleSummaryButton();
      }
    });
  };

  const handleSummaryButton = () => {
    // 1. GPT 사용 횟수가 3번 이상이면 요약을 진행할 수 없다는 알림 표시
    console.log("카운트gpt ", summaryCount);
    if (summaryCount >= summaryCountLimit) {
      Swal.fire({
        title: "요약 횟수 제한",
        text: `요약은 하루 최대 ${summaryCountLimit}번이 가능합니다.`,
        customClass: {
          popup: "custom-swal-popup",
        },
        icon: "error",
        confirmButtonColor: "#03C777",
        confirmButtonText: "확인",
      });
      return;
    }
    // 2. 입력된 내용이 비어 있으면 알림 표시
    if (inputText.trim().length === 0) {
      Swal.fire({
        title: "입력 내용 확인",
        text: "요약 내용이 비어있습니다.",
        customClass: {
          popup: "custom-swal-popup",
        },
        icon: "error",
        confirmButtonColor: "#03C777",
        confirmButtonText: "확인",
      });
      return;
    }
    // 모든 조건이 통과되면 summaryGPTPost 함수 호출
    summaryGPTPost(keywords);
  };

  const summaryGPTPost = async (keywords) => {
    setIsLoading(true);

    try {
      // 요약 요청 post api
      const requestData = {
        title: inputTitle, // 요약 타이틀
        content: inputText, // 요약에 작성한 content
        keywords: keywords, // 추가 키워드(최대 3개)
      };

      const response = await summariesApi.post(``, requestData);
      console.log("GPTPostApi: ", response.data);

      Swal.fire({
        title: "요약 성공",
        customClass: {
          popup: "custom-swal-popup",
        },
        text: "요약이 완료되었습니다.",
        icon: "success",
        confirmButtonColor: "#03C777",
        confirmButtonText: "확인",
      });

      setInputTitle("");
      setInputText("");
      setKeywords([]);
      setSummaryCount(response.data.data.summaryCount);

      resetSummaryContent();

      // const res = await summariesApi.get("", { params: { page: summaryPage } });
      fetchGetSummaryList();
    } catch (error) {
      Swal.fire({
        title: "요약 실패",
        customClass: {
          popup: "custom-swal-popup",
        },
        text: "요약 요청 중 오류가 발생했습니다.",
        icon: "error",
        confirmButtonText: "확인",
        confirmButtonColor: "#03C777",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="absolute bg-[#333333] bg-opacity-70 right-[3vw] w-[24vw] h-[84vh] my-[3vh] rounded-lg flex flex-col items-center justify-between p-5">
      <div className="flex flex-col justify-between w-full h-full">
        <h2 className="text-white text-[30px] font-bold pb-3 border-b mb-5">
          요약 문서 작성 도구
        </h2>

        <div className="h-full flex flex-col justify-between">
          <div className="flex flex-col justify-between h-[90%] mb-5">
            <div className="flex flex-col justify-between h-full">
              <input
                type="text"
                value={inputTitle}
                onChange={handleInputTitleChange}
                maxLength={inputTitleLimit}
                placeholder={`제목을 입력하세요. (최대 ${inputTitleLimit}자)`}
                className="rounded-xl mb-3"
              />
              <textarea
                type="text"
                value={inputText}
                onChange={handleInputChange}
                placeholder={`ChatGPT를 사용해 요약하고 싶은 내용을 작성하세요. 메모에서 드래그한 내용을 붙여넣기가 가능합니다. (최대 ${inputTextLimit}자, 일일 이용횟수 ${summaryCountLimit}회 제한)`}
                className="h-[92%] rounded-xl p-2 w-full custom-scrollbar"
              />
              <div className="text-[#C5C5C5] text-start text-[15px] my-2">
                현재 입력 글자 수: {inputText.length} / {inputTextLimit}
              </div>
            </div>
            {/* 추가 키워드 입력 필드 */}
            <div className="pt-3 border-t">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={keywordInput}
                  onChange={handleKeywordInputChange}
                  placeholder="추가 키워드를 입력하세요."
                  className="border border-gray-300 p-2 w-full rounded-xl"
                />
                {/* 키워드 추가 버튼 (아이콘 형식) */}
                <button
                  onClick={() => addKeyword()}
                  className="bg-[#66aadf] rounded-xl px-5 py-2 hover:bg-[#4d90d8] focus:ring-4 focus:ring-[#66aadf] font-bold text-white"
                  aria-label="키워드 추가"
                >
                  +
                </button>
              </div>
              {/* 추가된 키워드 리스트 표시 */}
              <div className="mt-2">
                <h3 className="text-[#C5C5C5] text-start text-[15px] mb-1">
                  추가된 키워드({keywords.length} / {keywordsLimit}):
                </h3>
                <div className="flex flex-wrap grid grid-cols-2 gap-2">
                  {keywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="flex justify-between items-center bg-[#66aadf] rounded-xl hover:bg-[#4d90d8] focus:ring-4 focus:ring-[#66aadf] font-bold text-white px-2 py-1 mx-1 cursor-pointer"
                      onClick={() => removeKeyword(keyword)}
                    >
                      {keyword}
                      <TiDelete />
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="w-full flex justify-center gap-x-3 mb-3">
            <button
              className="bg-[#03c777] rounded-xl px-5 py-2 hover:bg-[#02a566] focus:ring-4 focus:ring-[#03c777] text-white font-bold"
              onClick={() => openSummaryModal(memoData.title, keywords)}
            >
              요약하기
            </button>
            <button
              className="text-white font-bold px-5 py-2 rounded-xl bg-[#7C7C7C] hover:bg-[#5C5C5C]"
              onClick={() => {
                resetInputTitle();
                resetInputText();
                resetKeyWords();
              }}
            >
              내용삭제
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MemoDetailPrompt;

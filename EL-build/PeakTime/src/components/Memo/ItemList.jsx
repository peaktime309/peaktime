import { useState, useEffect, useRef, useCallback } from "react";
import Swal from "sweetalert2";
import memosApi from "../../api/memosApi";
import summariesApi from "../../api/summariesApi";
import dayjs from "dayjs";
import { TiDelete } from "react-icons/ti";
import { useMemoStore } from "../../stores/MemoStore";
import ItemNavigator from "./ItemNavigator";
import "../../styles/daily-report-custom-swal.css";

function ItemList() {
  const {
    activeTab,
    summaryCount,
    setSummaryCount,
    summaryCountLimit,
    memoPage,
    memoList,
    isMemoLastPage,
    setMemoList,
    setSelectedMemo,
    resetMemoContent,
    summaryPage,
    summaryList,
    isSummaryLastPage,
    setSummaryList,
    setSelectedSummary,
    resetSummaryContent,
  } = useMemoStore();

  const [isFetching, setIsFetching] = useState(false);

  const fetchGetMemoList = useCallback(async () => {
    if (isMemoLastPage || isFetching) return;

    setIsFetching(true);

    try {
      // 메모 전체 조회 GET 요청을 보내기
      const response = await memosApi.get(``, { params: { page: memoPage } });
      console.log("memoListGetApi: ", response.data);

      const data = response.data.data;
      const addMemoList = data.memoList;
      const summaryCount = data.summaryCount;
      const isLastPage = data.isLastPage;

      setMemoList(addMemoList, isLastPage); // 상태를 업데이트하여 UI에 반영
      setSummaryCount(summaryCount);
    } catch (error) {
      console.error("Error fetching memoList:", error);
      throw error;
    } finally {
      setIsFetching(false);
    }
  }, [isMemoLastPage, memoPage, isFetching, setMemoList, setSummaryCount]);

  const deleteMemo = async (memoId) => {
    try {
      // 메모 삭제 delete 요청 보내기
      const response = await memosApi.delete(`/${memoId}`);
      console.log("memoDeleteApi: ", response.data);

      resetMemoContent();
      fetchGetMemoList();
    } catch (error) {
      console.error("error delete memo api", error);
    }
  };

  // 생성날짜 바로 보이게 처리
  const formatDate = (createdAt) => {
    return dayjs(createdAt).format("YY.MM.DD HH:mm:ss");
  };

  // 메모 삭제
  const openDeleteWarn = (title, memoId) => {
    Swal.fire({
      title: "메모 삭제",
      text: `${title}을 정말로 삭제하시겠습니까?`,
      customClass: {
        popup: "custom-swal-popup",
      },
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "삭제",
      cancelButtonText: "취소",
      confirmButtonColor: "#F40000",
      cancelButtonColor: "#3085d6",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMemo(memoId);
      }
    });
  };

  const fetchGetSummaryList = useCallback(async () => {
    if (isSummaryLastPage || isFetching) return;

    setIsFetching(true);

    try {
      // 요약 리스트 전체 조회 GET 요청을 보내기
      const response = await summariesApi.get(``, {
        params: { page: summaryPage },
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
  }, [isSummaryLastPage, summaryPage, isFetching, setSummaryList]); // setsummarycount 제외

  // 요약 삭제
  const deleteSummary = async (summaryId) => {
    try {
      // 메모 삭제 delete 요청 보내기
      const response = await summariesApi.delete(`/${summaryId}`);
      console.log("summaryDeleteApi: ", response.data);

      resetSummaryContent();
      fetchGetSummaryList();
    } catch (error) {
      console.error("error delete summary api", error);
      Swal.fire({
        title: `요약 삭제를 실패했습니다.`,
        text: "요약 삭제를 실패했습니다. 잠시 후 다시 시도해주세요.",
        customClass: {
          popup: "custom-swal-popup",
        },
        icon: "warning",
        confirmButtonText: "확인",
        confirmButtonColor: "#7C7C7C",
      });
    }
  };

  // 요약 삭제
  const openSummaryDeleteWarn = (title, summaryId) => {
    Swal.fire({
      title: "요약 삭제",
      text: `${title}을 정말로 삭제하시겠습니까?`,
      customClass: {
        popup: "custom-swal-popup",
      },
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "삭제",
      cancelButtonText: "취소",
      confirmButtonColor: "#F40000",
      cancelButtonColor: "#3085d6",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteSummary(summaryId);
      }
    });
  };

  // 무한 스크롤
  const observerRef = useRef(null);

  useEffect(() => {
    fetchGetMemoList();
    fetchGetSummaryList();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          if (activeTab === "memo" && !isMemoLastPage) {
            fetchGetMemoList();
          } else if (activeTab === "summary" && !isSummaryLastPage) {
            fetchGetSummaryList();
          } else {
            return;
          }
        }
      },
      { threshold: 1.0 }
    );

    const currentObserverRef = observerRef.current;
    if (currentObserverRef) {
      observer.observe(currentObserverRef);
    }

    return () => {
      if (currentObserverRef) {
        observer.unobserve(currentObserverRef);
      }
    };
  }, [
    fetchGetMemoList,
    fetchGetSummaryList,
    isMemoLastPage,
    isSummaryLastPage,
  ]);

  return (
    <div className="absolute bg-[#333333] bg-opacity-70 left-[11vw] w-[29vw] h-[84vh] my-[3vh] rounded-lg flex flex-col justify-start items-center text-start p-5">
      <div className="flex flex-col">
        <div className="flex justify-between text-white mb-3">
          <h2 className="text-[30px] font-bold">
            {activeTab === "memo" ? "메모" : "요약"}
          </h2>
          <ItemNavigator />
        </div>

        <div className="flex flex-col gap-5 bg-white text-[20px] w-[25vw] h-[70vh] overflow-y-auto rounded-lg p-5 custom-scrollbar mb-3">
          {activeTab === "memo" ? (
            <>
              {memoList.map((memo, idx) => (
                <div
                  className={`flex justify-between mx-2 pb-2 ${
                    idx === memoList.length - 1 ? "" : "border-b"
                  }`}
                  key={idx}
                >
                  <button
                    className="w-[90%] flex flex-col"
                    onClick={() => setSelectedMemo(memo.memoId)}
                  >
                    <div className="font-bold mb-2">{memo.title}</div>
                    <div className="text-[18px]">
                      {formatDate(memo.createdAt)}
                    </div>
                  </button>
                  <div className="flex justify-end w-[10%]">
                    <button
                      className="text-[30px]"
                      onClick={() => openDeleteWarn(memo.title, memo.memoId)}
                    >
                      <TiDelete />
                    </button>
                  </div>
                </div>
              ))}
              <div ref={observerRef} />
            </>
          ) : (
            <>
              {summaryList.map((summary, idx) => (
                <div
                  key={summary.summaryId}
                  className={`flex justify-between mx-2 pb-2 ${
                    idx === summaryList.length - 1 ? "" : "border-b"
                  }`}
                >
                  <button
                    className="w-[90%] flex flex-col"
                    onClick={() => setSelectedSummary(summary.summaryId)}
                  >
                    <div className="font-bold mb-2">{summary.title}</div>
                    <div className="text-[18px]">
                      {formatDate(summary.createdAt)}
                    </div>
                  </button>
                  <div className="flex justify-end w-[10%]">
                    <button
                      className="text-[30px]"
                      onClick={() =>
                        openSummaryDeleteWarn(summary.title, summary.summaryId)
                      }
                    >
                      <TiDelete />
                    </button>
                  </div>
                </div>
              ))}
              <div ref={observerRef} />
            </>
          )}
        </div>

        <div className="w-full text-white text-[25px] flex justify-end mb-3">
          <div className="text-white font-bold text-[20px]">
            남은 요약 횟수: {summaryCountLimit - summaryCount} /{" "}
            {summaryCountLimit}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ItemList;

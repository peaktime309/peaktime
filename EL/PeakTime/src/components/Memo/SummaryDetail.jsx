import dayjs from "dayjs";
import Swal from "sweetalert2";
import { useMemoStore } from "../../stores/MemoStore";
import summariesApi from "../../api/summariesApi";
import "../../styles/daily-report-custom-swal.css";
import "../../styles/custom-scrollbar.css";
import html2pdf from "html2pdf.js";
import { useEffect, useState } from "react";

function SummaryDetail() {
  const {
    summaryData,
    setSummaryData,
    setSummaryList,
    resetSummaryContent,
    resetSummaryData,
    selectedSummary,
  } = useMemoStore();
  //   const { summaryId, title, content, createdAt } = summaryData;

  const [isFetching, setIsFetching] = useState(false);

  // 특정 요약 상세 정보 보기
  const readDetailSummaryGet = async () => {
    try {
      // 요약 상세정보 get api
      const response = await summariesApi.get(`/${selectedSummary}`);
      console.log("get detail summary api: ", response.data);

      setSummaryData({
        title: response.data.data.title,
        content: response.data.data.content,
        createdAt: response.data.data.createdAt,
      });
    } catch (error) {
      console.error("Error get detail summary api", error);
      Swal.fire({
        title: "요약 정보 조회 실패",
        customClass: {
          popup: "custom-swal-popup",
        },
        text: "요약 조회 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
        icon: "error",
        confirmButtonText: "확인",
        confirmButtonColor: "#7C7C7C",
      });
      throw error;
    }
  };

  // MemoList에서 클릭 시 메모 상세조회 실행
  useEffect(() => {
    readDetailSummaryGet();
  }, [selectedSummary]);

  // 생성날짜 바로 보이게 처리
  const formatDate = (date) => {
    return dayjs(date).format("YY.MM.DD HH:mm:ss");
  };

  // md 형식으로 변환시키기
  const convertToMarkdown = (text) => {
    // 마침표를 기준으로 텍스트를 분할
    const sentences = text.split(/(?<=\.)\s+/);
    let markdown = "";

    // 첫 번째 문장은 제목으로 간주
    markdown += `# ${sentences[0].trim()}\n\n`;

    // 나머지 문장들은 리스트 항목으로 추가
    for (let i = 1; i < sentences.length; i++) {
      const trimmedSentence = sentences[i].trim();
      if (trimmedSentence) {
        markdown += `- ${trimmedSentence}\n`;
      }
    }

    return markdown;
  };

  // markdown 미리보기
  const showMarkdownModal = (content) => {
    const markdownContent = convertToMarkdown(content);

    // SweetAlert2 모달로 Markdown 결과 보여주기
    Swal.fire({
      title: "Markdown 미리보기",
      html: `<pre style="text-align: left; white-space: pre-wrap;">${markdownContent}</pre>`,
      width: 600,
      customClass: {
        popup: "custom-swal-popup",
      },
      // 3개 버튼 사용
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "PDF로 다운로드",
      denyButtonText: "Markdown 파일로 다운로드",
      cancelButtonText: "닫기",
      confirmButtonColor: "#3085d6",
      denyButtonColor: "#03C777",
      cancelButtonColor: "#F40000",
    }).then((result) => {
      if (result.isConfirmed) {
        downloadPDFFile(markdownContent);
      } else if (result.isDenied) {
        downloadMDFile(markdownContent);
      }
    });
  };

  // md파일 다운로드
  const downloadMDFile = (content) => {
    const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `summary_${selectedSummary}.md`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  // pdf 파일 다운로드
  // html 태그로 형성시켜서 pdf로 내보내기
  const downloadPDFFile = (content) => {
    // 마지막 줄에 빈 줄 추가 (잘림 방지)
    content += "\n";

    const element = document.createElement("div");
    element.innerHTML = content
      .replace(/#/g, "<h1>")
      .replace(/\n/g, "<br>")
      .replace(/- /g, "<li>")
      .replace(/<\/li><br>/g, "</li>");

    const options = {
      margin: 1,
      filename: `summary_${selectedSummary}.pdf`,
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" }, //inch a4크기 portrait(세로 방향)
    };

    html2pdf().from(element).set(options).save();
  };

  return (
    <div className="absolute left-[43vw] w-[54vw] h-[84vh] my-[3vh] bg-[#333333] bg-opacity-70 rounded-lg p-5 flex flex-col items-center justify-between">
      <h2 className="w-full text-white text-[30px] font-bold pb-3 border-b mb-5">
        {summaryData.title}
      </h2>
      <div className="flex h-full w-full gap-x-5 px-3">
        <div className="flex flex-col justify-between h-full w-full">
          <div className="flex w-full justify-between mb-3">
            <h2 className="text-white text-[20px] font-bold">요약 정보</h2>
            <div className="text-white">
              요약 일자: {formatDate(summaryData.createdAt)}
            </div>
          </div>
          <div className="h-full flex flex-col justify-between">
            <div className="min-h-[60vh] max-h-[60vh] text-left overflow-y-scroll p-3 bg-white custom-scrollbar">
              {summaryData.content}
            </div>
          </div>
        </div>
      </div>
      <div className="w-full flex justify-center gap-x-3 mb-3">
        <button
          className="bg-[#03c777] rounded-xl px-5 py-2 hover:bg-[#02a566] focus:ring-4 focus:ring-[#03c777] text-white font-bold"
          onClick={() => showMarkdownModal(summaryData.content)}
        >
          Markdown 미리보기 및 다운로드
        </button>
      </div>
    </div>
  );
}

export default SummaryDetail;

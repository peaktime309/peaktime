import { endHikingProcess } from "./endHiking.js";

// 하이킹 중 데이터 변수
let siteData = [];
let programData = [];
let isSiteDone = false;
let isProgramDone = false;

// 익스텐션 사이트정보 지정하기
export function siteProcess(data) {
  siteData = data;
  isSiteDone = true;
  console.log("site complete :", siteData);
}

// 일렉트론 프로그램정보 지정하기
export function programProcess(data) {
  programData = data;
  isProgramDone = true;
  console.log("program complete :", programData);
}

// 확인 함수
export async function checkDone(event, hikingId, accessToken) {
  try {
    if (isProgramDone && isProgramDone) {
      if (siteData.length <= 0) {
        const sumData = [...programData];
        await endHikingProcess(sumData, hikingId, accessToken); // API 요청
        event.reply("all-done", sumData);
      } else {
        const sumData = [...siteData, ...programData];
        await endHikingProcess(sumData, hikingId, accessToken); // API 요청
        event.reply("all-done", sumData);
      }
    } else {
      console.log("data is not ready.");
    }
  } catch (error) {
    console.error("Error in checkDone:", error); // 예외를 잡아서 로그로 출력
  }
}

// 시작할때 값 초기화하기
export function resetProcess() {
  siteData = [];
  programData = [];
  isSiteDone = false;
  isProgramDone = false;
}

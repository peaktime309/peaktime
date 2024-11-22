let ws;

function connectWebSocket() {
  ws = new WebSocket("ws://localhost:12345");

  ws.onopen = () => {
    console.log("WebSocket connected.");
  };

  ws.onmessage = (event) => {
    console.log("Message from server:", event.data);
  };

  ws.onclose = () => {
    console.log("WebSocket disconnected. Reconnecting...");
    setTimeout(connectWebSocket, 1000); // 1초 후 재연결
  };

  ws.onerror = (error) => {
    console.error("WebSocket error:", error);
  };
}

connectWebSocket();

// 익스텐션 설치 url 클릭
document.addEventListener("extensionUrl", (event) => {
  console.log("link click event : ", event.detail);
  if (event.detail.url) {
    console.log(window.electronAPI);
    console.log(event.detail.url);
    window.electronAPI.openLink(event.detail.url);
  }
});

//하이킹 시작

document.addEventListener("hikingStart", (event) => {
  console.log("스타트 커스텀 이벤트 발생, event정보 :", event.detail);
  if (typeof window !== "undefined" && window.electronAPI) {
    // 상태를 Electron 메인 프로세스로 보내기
    const user = JSON.parse(localStorage.getItem("user"));
    const accessToken = user?.accessToken;
    console.log("renderer.js userinfo : ", user);
    if (accessToken) {
      window.electronAPI.sendAccessToken(accessToken); // IPC 채널로 토큰 전달
      console.log("send accessToken info", accessToken);
    }
    window.electronAPI.sendBackUrl(event.detail.backUrl);
  }
  // WebSocket 전송 데이터 생성 및 저장
  const message = JSON.stringify({
    action: "start",
    websiteList: event.detail.selectedPreset.blockWebsiteArray,
    role: event.detail.isRoot,
    presetId: event.detail.selectedPreset.presetId,
    hikingId: event.detail.startedHikingId,
  });

  window.electronAPI.sendWebSocketMessage(message);
  // 메인 프로세스에 메시지 저장 요청
  window.electronAPI.sendStartMessage(message);

  // 차단 시스템 요청
  const data = {};
  const blockProgramList = event.detail.selectedPreset.blockProgramArray;
  console.log("start info: ", event.detail);
  for (let program of blockProgramList) {
    console.log("data insert program : ", program);
    data[program] = 0;
  }
  console.log("start program data : ", data);
  window.electronAPI.startBlockProgram(data);
});

//하이킹 종료
document.addEventListener("hikingEnd", (event) => {
  window.electronAPI.sendStartMessage(null);

  console.log("하이킹 끝");
  window.electronAPI.sendWebSocketMessage(
    JSON.stringify({
      action: "end",
    })
  );

  window.electronAPI.endBlockProgram(event.detail.startedHikingId);
});

document.addEventListener("sendUrlList", (event) => {
  // WebSocket 전송 데이터 생성 및 저장
  const message = JSON.stringify({
    action: "sendUrlList",
    websiteList: event.detail.urlList,
  });
  window.electronAPI.sendWebSocketMessage(message);
});

let parsedMessage = null;
let isReceived = false;

// WebSocket 메시지를 수신하고 메시지 파싱만 담당
window.electronAPI.onWebSocketMessage((message) => {
  // 바이트 배열인지 확인하고 디코딩 처리
  let decodedMessage;

  if (message instanceof Uint8Array) {
    // Uint8Array를 문자열로 변환
    decodedMessage = new TextDecoder().decode(message);
  } else {
    // 이미 문자열 형태로 전달된 경우
    decodedMessage = message;
  }

  // JSON 파싱
  parsedMessage = JSON.parse(decodedMessage);
  isReceived = true;
});

// 상태를 구독하여 처리하는 함수
function checkMessageStatus() {
  if (isReceived) {
    // 메시지가 수신되었을 때 처리
    handleParsedMessage(parsedMessage);

    // 처리 후 상태 초기화
    isReceived = false; // 상태 초기화
  }
}

// 상태를 주기적으로 체크하는 타이머 (불필요하면 없애도 됩니다)
setInterval(checkMessageStatus, 100); // 100ms마다 상태 체크

// 메시지 처리 함수
function handleParsedMessage(parsedMessage) {
  console.log("메시지 처리 함수 실행 :", parsedMessage);
  if (parsedMessage.action === "end") {
    // sendHikingInfo 호출을 분리한 처리로 이동
    window.electronAPI.sendHikingInfo(parsedMessage);
  }
  if (parsedMessage.action === "saveMemo") {
    console.log("savememo renderer");
    window.electronAPI.sendSaveMemo(parsedMessage); // preload에서 electronAPi 설정한 곳으로 이동
  }
  if (parsedMessage.action === "addUrl") {
    console.log("addUrl renderer");
    window.electronAPI.sendAddUrl(parsedMessage); // preload에서 electronAPi 설정한 곳으로 이동
  }
}

document.addEventListener("quit", () => {
  window.electronAPI.quit();
});

document.addEventListener("reload", () => {
  window.electronAPI.reload();
});

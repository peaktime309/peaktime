import { startTracking, stopAndClearTracking } from "./tracking.js";

let socket;
const WEBSOCKET_URL = "ws://localhost:12345";
let reconnectAttempts = 0;
let socketConnected = false;

chrome.runtime.onStartup.addListener(() => {
  console.log("startup");
  connectWebSocket();
});

function connectWebSocket() {
  socket = new WebSocket(WEBSOCKET_URL);

  // WebSocket 연결 열림 이벤트
  socket.onopen = () => {
    console.log("WebSocket connected");
    reconnectAttempts = 0;
    sendPingMessage();
    chrome.alarms.create("keepAlive", { periodInMinutes: 0.2 }); // 1분마다 실행
  };

  // WebSocket 메시지 수신 이벤트
  socket.onmessage = (event) => {
    console.log("Message from server:", event.data);
    receivedSocketMessage(JSON.parse(event.data));
  };

  // WebSocket 오류 이벤트
  socket.onerror = (error) => {
    console.error("WebSocket error:", error);
    socket.close();
  };

  // WebSocket 연결 종료 이벤트
  socket.onclose = () => {
    console.log("WebSocket connection closed");
    socketConnected = false;
    retryConnect(); // 연결 종료 시 재연결 시도
  };
}

function sendPingMessage() {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send("ping");
    console.log("Ping sent to keep WebSocket alive.");
  }
}

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "keepAlive") {
    console.log("Alarm triggered. Keeping WebSocket alive.");
    sendPingMessage();
  }
});

// WebSocket 재연결 시도 함수
function retryConnect() {
  reconnectAttempts += 1;
  const delay = Math.min(Math.pow(2, reconnectAttempts) * 1000, 4000); // 최대 지연 시간 4초

  console.log(`Reconnecting in ${delay / 1000} seconds...`);
  setTimeout(connectWebSocket, delay);
}

function receivedSocketMessage(data) {
  if (data.action === "start") {
    socketConnected = true;

    console.log("website", data.websiteList);

    //하이킹 시작시 웹사이트 리스트와 프리셋 아이디 저장하기
    chrome.storage.local.set({ websiteList: data.websiteList });
    chrome.storage.local.set({ presetId: data.presetId });
    chrome.storage.local.set({ hikingId: data.hikingId });
    chrome.storage.local.set({ role: data.role });

    startTracking();
  }
  if (data.action === "end") {
    console.log("end");
    socketConnected = false;

    stopAndClearTracking();
  }
  if (data.action === "sendUrlList") {
    console.log("sendUrlList");
    // 데이터 저장
    chrome.storage.local.set({ websiteList: data.websiteList });
  }
}

//소켓으로 json 보내기
// function sendSocketMessage(data) {
//   console.log(data);
//   socket.send(JSON.stringify(data));
// }
function sendSocketMessage(data) {
  return new Promise((resolve, reject) => {
    // JSON 형태로 데이터 전송
    console.log("Sending data:", data);
    socket.send(JSON.stringify(data));

    // 응답을 받을 이벤트 리스너 추가
    const handleMessage = (event) => {
      try {
        const response = JSON.parse(event.data);
        console.log("Received response:", response);

        if (response.action === "start") {
          // 현재 활성 탭의 ID를 설정하고 URL 추적
          socketConnected = true;
        }

        // 응답을 받았으므로 Promise를 resolve하고 리스너를 제거합니다.
        resolve(response);
        socket.removeEventListener("message", handleMessage);
      } catch (error) {
        reject(error);
      }
    };

    // WebSocket 응답 대기
    socket.addEventListener("message", handleMessage);
  });
}

// 초기 WebSocket 연결 설정
connectWebSocket();

function getConnectStatus() {
  return socketConnected;
}

export { receivedSocketMessage, getConnectStatus, sendSocketMessage };

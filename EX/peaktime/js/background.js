// background.js (Service Worker)
import "./webSocket.js";
import "./saveText.js";
import "./tracking.js";
import {
  receivedSocketMessage,
  getConnectStatus,
  sendSocketMessage,
} from "./webSocket.js";

// 설치할때 실행
chrome.runtime.onInstalled.addListener(() => {
  console.log("extension installed");
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "quit") {
    receivedSocketMessage({ action: "end" });
  }
  if (msg.action === "checkSocketStatus") {
    const status = getConnectStatus();
    console.log(status);
    sendResponse({ connected: status });
  }
  if (msg.action === "addUrl") {
    (async () => {
      try {
        // 현재 URL을 크롬 저장소에 저장
        const data = await chrome.storage.local.get({ websiteList: [] });
        const websiteList = data.websiteList;
        websiteList.push(msg.url);

        await chrome.storage.local.set({ websiteList });
        console.log("Website list updated:", websiteList);

        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs.length > 0) {
            chrome.tabs.sendMessage(tabs[0].id, { action: "shutdown" });
          } else {
            console.error("활성 탭이 없습니다.");
          }
        });

        // presetId 값을 비동기적으로 가져오기
        const presetData = await chrome.storage.local.get("presetId");
        const presetId = presetData.presetId || null;

        // 일렉트론으로 URL과 presetId를 전송
        const response = await sendSocketMessage({
          action: "addUrl",
          url: msg.url,
          presetId,
        });

        console.log("response", response);

        // 비동기 작업이 완료되었음을 응답으로 알림
        sendResponse({ success: true });
      } catch (error) {
        console.error("Error handling addUrl action:", error);
        sendResponse({ success: false, error });
      }
    })();

    return true; // 비동기 응답을 위해 true 반환
  }
  if (msg.action === "saveMemo") {
    sendSocketMessage({
      action: "saveMemo",
      title: msg.title,
      content: msg.content,
    });
  }
});

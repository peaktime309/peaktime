import { sendSocketMessage } from "./webSocket.js";

let currentUrl = null;
let startTime = 0;
let isTracking = false;

// 시간 저장 및 Chrome Storage에 누적
async function recordTime(url) {
  if (!isTracking || !url) return;

  try {
    const urlObject = new URL(url);
    const domainName = urlObject.hostname; // 도메인만 추출
    const fullUrl = urlObject.href; // 전체 URL 문자열

    const endTime = Date.now();
    const timeSpent = endTime - startTime;

    const getUrlList = await chrome.storage.local.get(["urlList"]);
    const savedData = getUrlList.urlList || [];

    // 차단 목록 확인
    const { websiteList = [] } = await chrome.storage.local.get("websiteList");
    console.log("websiteList", websiteList);
    const shouldBlock = websiteList.some((urlPattern) =>
      fullUrl.includes(urlPattern)
    );

    const isBlock = shouldBlock;

    const newUrlData = {
      contentName: domainName,
      contentType: "site",
      usingTime: Math.floor(timeSpent / 1000),
      isBlockContent: isBlock,
    };

    const existingIndex = savedData.findIndex(
      (item) => item.contentName === domainName
    );
    if (existingIndex !== -1) {
      savedData[existingIndex].usingTime += newUrlData.usingTime;
    } else {
      savedData.push(newUrlData);
    }

    await chrome.storage.local.set({ urlList: savedData });

    console.log(
      `Domain: ${domainName}, 누적 사용 시간: ${newUrlData.usingTime}초, 차단 여부: ${isBlock}`
    );

    if (isBlock) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0) {
          chrome.tabs.sendMessage(tabs[0].id, { action: "shutdown" });
        } else {
          console.error("활성 탭이 없습니다.");
        }
      });
    }
  } catch (error) {
    console.warn(`Invalid URL: ${url}`, error);
  }
}

// 추적 중지 및 URL 리스트 삭제 (stop + quit 기능)
async function stopAndClearTracking() {
  if (isTracking && currentUrl) {
    await recordTime(currentUrl);
    console.log(`Tracking stopped for ${currentUrl}`);
  }
  chrome.storage.local.get(
    ["hikingId", "savedTexts", "savedTitle", "urlList"],
    (data) => {
      const hikingId = data.hikingId;
      const savedTexts = data.savedTexts || "";
      const savedTitle = data.savedTitle || "메모명";
      const urlList = data.urlList || {};

      console.log("Hiking ID:", hikingId);
      console.log("Saved Texts:", savedTexts);
      console.log("Saved Title:", savedTitle);
      console.log("URL 리스트:", urlList);

      sendSocketMessage({
        action: "end",
        urlList: urlList,
        hikingId: hikingId,
        content: savedTexts,
        title: savedTitle,
      });

      // 상태 초기화
      isTracking = false;
      currentUrl = null;

      // 로컬 스토리지 전체 삭제
      chrome.storage.local.clear(() => {
        console.log("모든 로컬 스토리지 데이터가 삭제되었습니다.");
        removeListeners();
      });
    }
  );
}

// 이벤트 리스너 제거 함수
function removeListeners() {
  chrome.tabs.onUpdated.removeListener(handleTabUpdate);
  chrome.tabs.onActivated.removeListener(handleTabActivation);
  console.log("이벤트 리스너가 제거되었습니다.");
}

let currentTabId = "";
// 추적 시작 (특정 이벤트 발생 시)
function startTracking() {
  if (isTracking) return;

  currentUrl = null;
  startTime = Date.now();
  isTracking = true;
  console.log(`Tracking started`);

  // 이벤트 리스너 추가
  chrome.tabs.onUpdated.addListener(handleTabUpdate);
  chrome.tabs.onActivated.addListener(handleTabActivation);
}

// URL이 변경될 때마다 호출
function handleUrlChange(newUrl) {
  const urlObject = new URL(newUrl);
  const hostname = urlObject.hostname; // 도메인만 (예: example.com)
  const currentPath = urlObject.pathname; // 경로만 (예: /path/to/page)
  const fullUrl = hostname + currentPath;

  if (currentUrl !== fullUrl) {
    if (currentUrl) {
      recordTime(urlObject); // 이전 URL의 시간 기록
    }
    currentUrl = fullUrl; // 새로운 URL 설정
    startTime = Date.now(); // 시작 시간 초기화
    console.log(`Tracking URL 변경: ${fullUrl}`);
  }

  chrome.storage.local.get({ websiteList: [] }, function (data) {
    const websiteList = data.websiteList || [];
    const shouldBlock = websiteList.some((urlPattern) =>
      fullUrl.includes(urlPattern)
    );
    console.log("Should block:", shouldBlock);

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(
          tabs[0].id,
          { action: "checkContentScript" },
          (response) => {
            if (chrome.runtime.lastError || !response) {
              chrome.scripting.executeScript(
                {
                  target: { tabId: tabs[0].id },
                  files: ["/js/contentScript.js"],
                },
                () => {
                  if (shouldBlock) {
                    chrome.tabs.sendMessage(tabs[0].id, { action: "shutdown" });
                  }
                }
              );
            } else if (shouldBlock) {
              chrome.tabs.sendMessage(tabs[0].id, { action: "shutdown" });
            }
          }
        );
      }
    });
  });
}

// 탭 업데이트 이벤트 핸들러
function handleTabUpdate(tabId, changeInfo, tab) {
  if (changeInfo.status === "complete" && tab.active) {
    handleUrlChange(tab.url);
  }
}

// 탭 활성화 이벤트 핸들러
function handleTabActivation(activeInfo) {
  getCurrentTabUrl((url) => {
    handleUrlChange(url);
  });
}

// 현재 활성화된 탭의 URL을 가져오기
function getCurrentTabUrl(callback) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length > 0) {
      callback(tabs[0].url);
    }
  });
}

// Storage 변경 사항을 감지하고 업데이트된 차단 URL 목록을 반영
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (changes.websiteList) {
    console.log("차단 URL 목록이 변경되었습니다.");
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach((tab) => {
        handleUrlChange(tab.url); // 각 열린 탭에서 URL 차단을 적용
      });
    });
  }
});

export { startTracking, stopAndClearTracking };

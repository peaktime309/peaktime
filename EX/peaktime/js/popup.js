// popup.js

// 저장된 텍스트와 제목을 초기화하는 함수
function clearStorage(textarea, title) {
  // 텍스트 내용 초기화
  chrome.storage.local.remove("savedTexts", function () {
    if (textarea) {
      textarea.value = "";
      document.querySelector(".comment_length").textContent = "0";
    }
  });

  // 제목 초기화
  chrome.storage.local.remove("savedTitle", function () {
    if (title) {
      title.value = "메모명";
      document.querySelector(".title_length").textContent = "3";
    }
  });
}

//사용자가 익스텐션을 열었을 경우
document.addEventListener("DOMContentLoaded", function () {
  const textarea = document.getElementById("savedText");
  const resetButton = document.getElementById("reset");
  const title = document.getElementById("title");
  const addUrlButton = document.getElementById("addUrl");
  const saveMemoButton = document.getElementById("save");
  // role 값을 가져와서 버튼 표시 여부 결정
  chrome.storage.local.get("role", (data) => {
    // role이 "child"인 경우 버튼 숨기기
    if (data.role === "child" && addUrlButton) {
      addUrlButton.remove();
    }
  });

  // 팝업이 열리면 저장된 텍스트 가져와서 textarea에 추가
  chrome.storage.local.get({ savedTexts: [] }, function (data) {
    const savedTexts = Array.isArray(data.savedTexts)
      ? data.savedTexts
      : [data.savedTexts];

    // savedTexts 배열을 하나의 문자열로 합치고, 줄바꿈을 한 번만 추가
    const combinedText = savedTexts.join("");

    // textarea에 추가
    textarea.value = combinedText;

    // 글자 수 업데이트
    document.querySelector(".comment_length").textContent =
      textarea.value.length;
  });

  chrome.storage.local.get({ savedTitle: "메모명" }, function (data) {
    title.value = data.savedTitle;
    document.querySelector(".title_length").textContent =
      title.value.length || "0";
  });

  // "reset" 버튼 클릭 이벤트
  if (resetButton) {
    resetButton.onclick = function () {
      clearStorage(textarea, title);
    };
  }

  //url 추가 이벤트
  if (addUrlButton) {
    addUrlButton.onclick = function () {
      // 현재 활성 탭의 정보를 가져와 select에 추가
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const url = tabs[0].url; // 현재 탭의 URL
        const urlObject = new URL(url); // URL 객체 생성
        const hostname = urlObject.hostname; // 도메인만 추출
        //버튼 클릭시 전체 url 보내기
        chrome.runtime.sendMessage({ action: "addUrl", url: hostname });

        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs.length > 0) {
            chrome.tabs.sendMessage(tabs[0].id, {
              action: "showSaveUrlModal",
              currentUrl: hostname,
            });
          } else {
            console.error("활성 탭이 없습니다.");
          }
        });
      });
    };
  }

  if (saveMemoButton) {
    saveMemoButton.onclick = function () {
      const content = textarea.value;
      const memoTitle = title.value;

      if (memoTitle.length < 2) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs.length > 0 && tabs[0].id) {
            chrome.tabs.sendMessage(tabs[0].id, {
              action: "showSaveMemoFailModal",
            });
          } else {
            console.error("활성 탭이 없습니다.");
          }
        });
        return; // 제목이 2글자 미만일 경우 함수 종료
      }

      //내용 소켓 통신으로 보내기
      chrome.runtime.sendMessage({
        action: "saveMemo",
        title: memoTitle,
        content: content,
      });

      //내용 초기화
      clearStorage(textarea, title);

      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0) {
          chrome.tabs.sendMessage(tabs[0].id, {
            action: "showSaveMemoSuccessModal",
          });
        } else {
          console.error("활성 탭이 없습니다.");
        }
      });
    };
  }

  // textarea의 글자 수 세기
  if (textarea) {
    textarea.addEventListener("input", function () {
      const content = this.value;

      // 글자수 세기
      document.querySelector(".comment_length").textContent =
        this.value.length || "0";

      // 3000자 초과 시 제한
      if (content.length > 3000) {
        this.value = content.substring(0, 3000);
      }
      // 로컬 스토리지에 저장
      console.log("CONTENT", content);
      chrome.storage.local.set({ savedTexts: this.value });
    });
  }

  // title의 글자 수 세기
  if (title) {
    title.addEventListener("input", function () {
      const content = this.value;
      // 15자 초과 시 제한
      if (content.length > 15) {
        this.value = content.substring(0, 15);
      }

      document.querySelector(".title_length").textContent =
        this.value.length || "0";
      chrome.storage.local.set({ savedTitle: this.value });
    });
  }
});

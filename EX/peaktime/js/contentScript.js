chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  if (msg.action === "shutdown") {
    console.log(msg);

    // body 내용 초기화
    document.body.innerHTML = "";
    document.head.innerHTML = "Block WebSite";

    // 이미지 설정
    const imageUrl = chrome.runtime.getURL("../image/image.png");

    // body에 직접 스타일 적용
    document.body.style.backgroundImage = `url('${imageUrl}')`; // 이미지 URL 설정
    document.body.style.backgroundSize = "cover"; // 이미지가 화면 전체를 덮도록 설정
    document.body.style.backgroundRepeat = "no-repeat"; // 이미지 반복 방지
    document.body.style.backgroundPosition = "center center"; // 이미지가 중앙에 위치하도록 설정
    document.body.style.width = "100vw"; // 가로 크기 100%
    document.body.style.height = "100vh"; // 세로 크기 100%
    document.body.style.margin = "0"; // 여백 없애기
    document.body.style.overflow = "hidden"; // 스크롤 방지
    document.body.style.pointerEvents = "none"; // 클릭 등 상호작용 차단
    document.body.style.cursor = "not-allowed"; // 금지된 커서 모양 표시

    // 응답 메시지
    sendResponse({ message: "Block WebSite" });
  }
  if (msg.action === "GET_SELECTED_TEXT") {
    //사용자가 드래그한 메시지 백그라운드로 보냄
    const selectedText = window.getSelection().toString();
    sendResponse({ text: selectedText || null });
  }
  if (msg.action === "showSaveUrlModal") {
    const modal = document.getElementById("save-url-modal");
    if (modal) {
      modal.style.display = "block"; // 모달 표시
      modal.textContent = msg.currentUrl + "가 추가되었습니다.";
      setTimeout(() => {
        modal.style.display = "none"; // 2초 후 자동 숨김
      }, 1000);
    }
    sendResponse({ message: "url이 추가되었습니다." });

    // return true;
  }
  if (msg.action === "showSaveMemoFailModal") {
    const modal = document.getElementById("save-fail-memo-modal");
    if (modal) {
      modal.style.display = "block"; // 모달 표시
      setTimeout(() => {
        modal.style.display = "none"; // 2초 후 자동 숨김
      }, 1000);
    }
    sendResponse({ message: "메모를 저장하는데 실패하였습니다." });

    // return true;
  }
  if (msg.action === "showSaveMemoSuccessModal") {
    const modal = document.getElementById("save-success-memo-modal");
    if (modal) {
      modal.style.display = "block"; // 모달 표시
      setTimeout(() => {
        modal.style.display = "none"; // 2초 후 자동 숨김
      }, 1000);
    }
    sendResponse({ message: "메모를 저장하는데 성공하였습니다." });

    // return true;
  }

  return true;
});

// 모달이 이미 추가되어 있지 않다면 추가
if (!document.getElementById("save-fail-memo-modal")) {
  const modal = document.createElement("div");
  modal.id = "save-fail-memo-modal";
  modal.style.position = "fixed";
  modal.style.top = "50%";
  modal.style.left = "50%";
  modal.style.transform = "translate(-50%, -50%)";
  modal.style.backgroundColor = "white";
  modal.style.padding = "20px";
  modal.style.boxShadow = "0px 0px 10px rgba(0, 0, 0, 0.5)";
  modal.style.zIndex = "1000";
  modal.style.display = "none"; // 모달을 초기에는 숨겨둠

  modal.innerHTML = "<h2>제목은 2글자 이상 되어야합니다.</h2>";
  document.body.appendChild(modal);
}

// 모달이 이미 추가되어 있지 않다면 추가
if (!document.getElementById("save-success-memo-modal")) {
  const modal = document.createElement("div");
  modal.id = "save-success-memo-modal";
  modal.style.position = "fixed";
  modal.style.top = "50%";
  modal.style.left = "50%";
  modal.style.transform = "translate(-50%, -50%)";
  modal.style.backgroundColor = "white";
  modal.style.padding = "20px";
  modal.style.boxShadow = "0px 0px 10px rgba(0, 0, 0, 0.5)";
  modal.style.zIndex = "1000";
  modal.style.display = "none"; // 모달을 초기에는 숨겨둠

  modal.innerHTML = "<h2>메모가 성공적으로 저장되었습니다.</h2>";
  document.body.appendChild(modal);
}

// 모달이 이미 추가되어 있지 않다면 추가
if (!document.getElementById("save-url-modal")) {
  const modal = document.createElement("div");
  modal.id = "save-url-modal";
  modal.style.position = "fixed";
  modal.style.top = "50%";
  modal.style.left = "50%";
  modal.style.transform = "translate(-50%, -50%)";
  modal.style.backgroundColor = "white";
  modal.style.padding = "20px";
  modal.style.boxShadow = "0px 0px 10px rgba(0, 0, 0, 0.5)";
  modal.style.zIndex = "1000";
  modal.style.display = "none"; // 모달을 초기에는 숨겨둠

  modal.innerHTML = "<h2>url이 추가되었습니다.</h2>";
  document.body.appendChild(modal);
}

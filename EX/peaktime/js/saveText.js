chrome.commands.onCommand.addListener((command) => {
  if (command === "save_selected_text") {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      // Content script가 활성 탭에 로드되었는지 확인하고, 없으면 로드
      chrome.scripting.executeScript(
        {
          target: { tabId: tabs[0].id },
          func: () => {
            const selectedText = window.getSelection().toString();
            chrome.runtime.sendMessage({
              action: "GET_SELECTED_TEXT",
              text: selectedText,
            });
          },
        },
        () => {
          //컨텐츠스크립트에 메시지를 보내 드래그한 문장을 가져옴
          //가져온 메시지를 크롬 스토리지에 저장
          chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
            if (msg.action === "GET_SELECTED_TEXT") {
              chrome.storage.local.get({ savedTexts: [] }, function (data) {
                // 기존 저장된 텍스트에 새로운 텍스트 추가
                const updatedTexts = [...data.savedTexts, msg.text].join("");

                // 3000자로 제한
                const limitedText =
                  updatedTexts.length > 3000
                    ? updatedTexts.slice(0, 3000)
                    : updatedTexts;

                // 제한된 텍스트 저장
                chrome.storage.local.set(
                  { savedTexts: limitedText },
                  function () {
                    console.log("save : ", limitedText);
                  }
                );
              });
            }
          });
        }
      );
    });
  }
});

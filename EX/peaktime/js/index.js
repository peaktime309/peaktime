chrome.runtime.sendMessage({ action: "checkSocketStatus" }, (response) => {
    //타이머 시작할때 popup.html로 띄우기
    if (response.connected) window.location.href = "popup.html";
});
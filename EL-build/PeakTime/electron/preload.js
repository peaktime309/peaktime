const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  onWebSocketConnect: (callback) =>
    ipcRenderer.on("websocket-on", (event, data) => callback(data.type)),
  openLink: (url) => ipcRenderer.send("open-link", url),
  getBackUrl: () => ipcRenderer.invoke("getBackUrl"),
  sendWebSocketMessage: (message) =>
    ipcRenderer.send("websocket-message", message),
  onWebSocketMessage: (callback) =>
    ipcRenderer.on("websocket-message", (event, message) => callback(message)),
  //토큰 전달
  sendAccessToken: (token) => ipcRenderer.send("sendAccessToken", token),
  //url 전달
  sendBackUrl: (url) => ipcRenderer.send("sendBackUrl", url),
  // 하이킹 종료시 정보 주고받기
  sendHikingInfo: (data) => {
    ipcRenderer.send("hikingInfo", data);
  },
  // 프로그램 차단 시작
  startBlockProgram: (data) => {
    ipcRenderer.send("start-block-program", data);
  },
  // 프로그램 차단 종료
  endBlockProgram: (data) => {
    ipcRenderer.send("end-block-program", data);
  },
  // 하이킹종료 프로세스 모두 완료시
  onAllDone: (callback) => {
    ipcRenderer.on("all-done", (event, data) => callback(data));
  },

  sendStartMessage: (message) => ipcRenderer.send("set-start-hiking", message),

  sendSaveMemo: (data) => {
    console.log("sendSaveMemo", data);
    ipcRenderer.send("save-memo", data);
  },
  onSaveMemo: (callback) => {
    // 이미 리스너가 등록되어 있는지 확인
    if (ipcRenderer.listenerCount("save-memo-response") === 0) {
      ipcRenderer.on("save-memo-response", (event, data) => {
        console.log("onsavememo 콜백 전");
        console.log(data);
        callback(data);
      });
    } else {
      console.log("이미 onSaveMemo 리스너가 등록되어 있습니다.");
    }
  },
  sendAddUrl: (data) => {
    console.log("sendAddUrl", data);
    ipcRenderer.send("add-url", data);
  },
  onAddUrl: (callback) => {
    if (ipcRenderer.listenerCount("add-url-response") === 0) {
      ipcRenderer.on("add-url-response", (event, data) => {
        console.log("onaddurl 콜백 전");
        console.log(data);
        callback(data);
      });
    } else {
      console.log("이미 onAddUrl 리스너가 등록되어 있습니다.");
    }
  },

  quit: () => {
    ipcRenderer.send("quit-app");
  },

  reload: () => {
    ipcRenderer.send("reload-window");
  },
});

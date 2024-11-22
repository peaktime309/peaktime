import { useState, useEffect } from "react";

function Menubar() {
  const [isMaximized, setIsMaximized] = useState(false);

  // 커스텀 이벤트를 발생시켜서 main 프로세스에 신호를 보냄
  const sendCustomEvent = (eventName) => {
    const event = new CustomEvent(eventName);
    window.dispatchEvent(event);
  };

  // 함수: 창 최소화
  const minimizeWindow = () => {
    sendCustomEvent("minimize-window");
  };

  // 함수: 창 최대화/복원
  const maximizeWindow = () => {
    sendCustomEvent("toggle-maximize-window");
    setIsMaximized(!isMaximized);
  };

  // 함수: 창 닫기
  const closeWindow = () => {
    sendCustomEvent("close-window");
  };

  // 더블 클릭 시 최대화/복원
  const handleDoubleClick = () => {
    maximizeWindow();
  };

  // 드래그 시작
  const startDrag = () => {
    sendCustomEvent("start-drag");
  };

  // 윈도우의 최대화 상태 확인
  useEffect(() => {
    window.addEventListener("window-maximized", () => setIsMaximized(true));
    window.addEventListener("window-unmaximized", () => setIsMaximized(false));

    return () => {
      window.removeEventListener("window-maximized", () =>
        setIsMaximized(true)
      );
      window.removeEventListener("window-unmaximized", () =>
        setIsMaximized(false)
      );
    };
  }, []);

  return (
    <div
      className="w-full h-[4vh] bg-[#66aadf] flex justify-between items-center"
      onDoubleClick={handleDoubleClick}
      onMouseDown={startDrag}
    >
      <div className="ms-5 font-bold cursor-pointer">PeakTime</div>
      <div className="flex gap-2 me-5">
        <button
          onClick={minimizeWindow}
          className="w-8 h-8 bg-gray-300 hover:bg-gray-400 rounded"
        >
          –
        </button>
        <button
          onClick={maximizeWindow}
          className="w-8 h-8 bg-gray-300 hover:bg-gray-400 rounded"
        >
          {isMaximized ? "↘" : "□"}
        </button>
        <button
          onClick={closeWindow}
          className="w-8 h-8 bg-red-500 hover:bg-red-600 rounded text-white"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export default Menubar;

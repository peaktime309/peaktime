import { useEffect, useRef, useState } from "react";
import { AiOutlineDisconnect } from "react-icons/ai";
import { FaCheck } from "react-icons/fa";

function HomePage() {
  const [isConnectedHome, setisConnectedHome] = useState(false);
  const isConnectedHomeRef = useRef(isConnectedHome);

  function handleLinkClick(url) {
    const extensionUrl = new CustomEvent("extensionUrl", {
      bubbles: true,
      detail: { url },
    });
    const connectDiv = document.getElementById("connect");
    if (connectDiv) {
      connectDiv.dispatchEvent(extensionUrl);
    }
  }

  useEffect(() => {
    isConnectedHomeRef.current = isConnectedHome;
  }, [isConnectedHome]);

  useEffect(() => {
    window.electronAPI.onWebSocketConnect((type) => {
      console.log(type);
      if (type === "connect") {
        console.log("WebSocket Connect!!!", isConnectedHomeRef.current);
        setisConnectedHome(true);
      } else if (type === "disconnect") {
        console.log("WebSocket Disconnect!!!", isConnectedHomeRef.current);
        setisConnectedHome(false);
      }
    });
  }, []);

  return (
    <div className="h-[100vh] flex relative">
      <div
        id="connect"
        className={`flex justify-center items-center absolute top-0 left-[10%] mt-5 w-[8vh] h-[8vh] rounded-full font-bold text-white text-3xl bg-${
          isConnectedHome ? "[#03c777]" : "[#ff7f00]"
        }`}
      >
        {isConnectedHome ? <FaCheck /> : <AiOutlineDisconnect />}
      </div>
      <div className="absolute top-[13%] left-[10%] text-2xl font-bold text-start text-white">
        {isConnectedHome ? (
          <>
            <span className="text-[#03c777] text-3xl">
              확장프로그램과 연결된 상태입니다! <br />
              <br />
            </span>
            사이트 차단이 정상적으로 작동합니다.
          </>
        ) : (
          <>
            <span className="text-[#ff7f00] text-3xl">
              확장프로그램과 연결이 필요합니다! <br />
              <br />
            </span>
            사이트 차단이 동작하지 않습니다. <br />
            크롬 브라우저에서{" "}
            <span
              onClick={() =>
                handleLinkClick(
                  "https://chromewebstore.google.com/detail/peaktime/mmfhicnmmemjolaepcgnekfpljoghebe?hl=ko"
                )
              }
              className="text-[#66aadf] text-3xl underline cursor-pointer"
            >
              PeakTime 확장프로그램
            </span>
            을 <br />
            실행해주시거나 설치해주세요 <br />
          </>
        )}
      </div>
    </div>
  );
}

export default HomePage;

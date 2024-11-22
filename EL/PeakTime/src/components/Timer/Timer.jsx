import { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import hikingsApi from "../../api/hikingsApi.js";
import memosApi from "../../api/memosApi.js";
import presetsApi from "../../api/presetsApi.js";
import { IoIosArrowDown } from "react-icons/io";
import { AiOutlineDisconnect } from "react-icons/ai";
import { FaCheck } from "react-icons/fa";
import { useUserStore } from "../../stores/UserStore.js";
import { EventSourcePolyfill } from "event-source-polyfill";
import { useBackgroundStore } from "../../stores/BackgroundStore.jsx";
import { MdAccessTimeFilled } from "react-icons/md";
import "../../styles/daily-report-custom-swal.css";
import { useRunningStore } from "../../stores/RunningStore.jsx";
import { useNavigate } from "react-router-dom";
import { usePresetStore } from "../../stores/PresetStore.jsx";

function Timer() {
  const { bg, bgActions } = useBackgroundStore();
  const [inputTime, setInputTime] = useState(""); // 사용자 입력 시간 (분 단위)
  const [totalTime, setTotalTime] = useState(0); // 타이머 시간 (분 단위)
  const [remainTime, setRemainTime] = useState(null); // 남은 시간 (초 단위)
  const [isRunning, setIsRunning] = useState(false); // 타이머 시작 상태
  const { running, runningActions } = useRunningStore(); // 상태 정보 스토어
  const [isSelf, setIsSelf] = useState(true);
  const workerRef = useRef(null);
  const [startedHikingId, setStartedHikingId] = useState(null); // 시작한 hikingId 정보
  const [timerPresetList, setTimerPresetList] = useState(null); // 프리셋 리스트
  const remainTimeRef = useRef(remainTime);
  const isRunningRef = useRef(isRunning);
  const hikingIdRef = useRef(startedHikingId);

  const { presetList } = usePresetStore.getState();

  useEffect(() => {
    if (presetList.length == 0) return;

    setTimerPresetList(presetList);
    setSelectedOption(null);
  }, [presetList]);

  useEffect(() => {
    remainTimeRef.current = remainTime;
  }, [remainTime]);

  useEffect(() => {
    isRunningRef.current = isRunning;
  }, [isRunning]);

  useEffect(() => {
    hikingIdRef.current = startedHikingId;
  }, [startedHikingId]);

  // 웹소켓 연결상태
  const [isConnected, setIsConnected] = useState(false);
  const isConnectedRef = useRef(isConnected);

  useEffect(() => {
    isConnectedRef.current = isConnected;
  }, [isConnected]);

  // 드롭다운 관련
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  // 최소화
  const [isSmall, setIsSmall] = useState(false);

  // sse messages
  const [messages, setMessages] = useState(null);
  const { user } = useUserStore();
  const localUser = JSON.parse(localStorage.getItem("user")) || null;

  const navigate = useNavigate();

  //현재 시간
  let [now, setNow] = useState(new Date());

  const startNow = () => {
    setInterval(() => {
      setNow(new Date());
    }, 5000);
  };

  // 시간 'mm:ss' 표시
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(
      2,
      "0"
    )}`;
  };

  // 타이머 시작
  const startTimer = (duration) => {
    setIsRunning(true);
    runningActions.setRunning(true);
    workerRef.current.postMessage({ type: "start", duration });
  };

  // 타이머 종료
  const pauseTimer = () => {
    workerRef.current.postMessage({ type: "pause" });
  };

  // 시작버튼 누르기
  const handleStart = () => {
    // 시간 정수화
    const time = parseInt(inputTime, 10);
    // 입력 시간 유효성 검사
    if (isNaN(time) || time <= 29) {
      Swal.fire({
        title: "올바른 시간을 입력하세요.",
        customClass: {
          popup: "custom-swal-popup",
        },
        icon: "error",
        text: "30분 ~ 240분 사이의 시간을 입력해주세요!",
        confirmButtonColor: "#03c777",
        confirmButtonText: "확인",
      });
      return;
    }

    // 프리셋 선택
    if (user.isRoot && selectedOption == null) {
      Swal.fire({
        title: "적용할 프리셋을 선택하세요.",
        customClass: {
          popup: "custom-swal-popup",
        },
        icon: "error",
        text: "하이킹을 시작하려면 프리셋을 선택해주세요",
        confirmButtonColor: "#03c777",
        confirmButtonText: "확인",
      });
      return;
    }
    // 진짜로 시작하기, api요청
    Swal.fire({
      title: `${formatTime(time * 60)} 길이의 하이킹을 \n 시작하시겠습니까?`,
      customClass: {
        popup: "custom-swal-popup",
      },
      showDenyButton: true,
      confirmButtonColor: "#03c777",
      denyButtonColor: "gray",
      confirmButtonText: "시작하기",
      denyButtonText: "취소",
      preConfirm: async () => {
        try {
          // 시작 확인 후 카운트다운 모달 표시
          const countdownSwal = await Swal.fire({
            title: "곧 하이킹이 시작됩니다!",
            text: "10초 후 자동으로 시작됩니다.",
            customClass: {
              popup: "custom-swal-popup",
            },
            backdrop: "rgba(0,0,0,0.9)",
            timer: 10000, // 10초 타이머
            timerProgressBar: true,
            didOpen: () => {
              bgActions.setBackground("mountain");

              Swal.showLoading();
            },
            willClose: () => {
              // 모달이 닫힐 때 추가 로직 필요 시 여기에 작성
            },
          });

          // 카운트다운 완료 후 하이킹 시작 로직 실행
          const now = new Date();
          const year = now.getFullYear();
          const month = now.getMonth() + 1;
          const day = now.getDate();
          const hour = now.getHours();
          const minute = now.getMinutes();
          const second = now.getSeconds();

          const format = `${year}-${("00" + month.toString()).slice(-2)}-${(
            "00" + day.toString()
          ).slice(-2)} ${("00" + hour.toString()).slice(-2)}:${(
            "00" + minute.toString()
          ).slice(-2)}:${("00" + second.toString()).slice(-2)}`;

          const startHikingData = {
            startTime: format,
            attentionTime: inputTime,
            isSelf: true,
          };

          // API 요청
          const responseStartHiking = await hikingsApi.post(
            "",
            startHikingData
          );

          // 상태 업데이트
          setStartedHikingId(responseStartHiking.data.data.hikingId);
          setTotalTime(time * 60);
          setRemainTime(time * 60);
          setIsSelf(true);

          let hikingStart;
          if (user.isRoot) {
            hikingStart = new CustomEvent("hikingStart", {
              bubbles: true,
              detail: {
                startedHikingId: responseStartHiking.data.data.hikingId,
                selectedPreset: selectedOption,
                backUrl: hikingsApi.defaults.baseURL,
                isRoot: user.isRoot ? "root" : "child",
              },
            });
          } else {
            hikingStart = new CustomEvent("hikingStart", {
              bubbles: true,
              detail: {
                startedHikingId: responseStartHiking.data.data.hikingId,
                selectedPreset: timerPresetList[0],
                backUrl: hikingsApi.defaults.baseURL,
                isRoot: user.isRoot ? "root" : "child",
              },
            });
          }

          const startBtn = document.getElementById("start");
          startBtn.dispatchEvent(hikingStart);
          startTimer(time * 60);
          navigate("/");
        } catch (err) {
          console.error("API 요청 중 오류 발생:", err);
          Swal.fire({
            title: "하이킹을 시작하는 데 실패했습니다.",
            customClass: {
              popup: "custom-swal-popup",
            },
            text: `오류 내용: ${err.response?.data?.message || err.message}`,
            icon: "error",
            confirmButtonColor: "#03c777",
            confirmButtonText: "확인",
          });
        }
      },
    });
  };

  // sse 등록
  useEffect(() => {
    // user 객체가 존재하고, root 사용자가 아닐 경우에만 실행
    if (user && !user.isRoot) {
      const accessToken = user.accessToken;

      // EventSourcePolyfill 인스턴스 생성 함수
      const createEventSource = () => {
        console.log("연결 시작");
        const eventSource = new EventSourcePolyfill(
          `${import.meta.env.VITE_BACK_URL}/api/v1/schedules`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              Accept: "text/event-stream",
            },
            heartbeatTimeout: 3600000,
          }
        );

        // 서버에서 메시지를 받을 때마다 실행
        eventSource.addEventListener("message", (event) => {
          // 수신된 메시지 데이터 파싱
          const data = event.data;
          console.log("Received event:", data);

          // 데이터가 JSON 형식일 경우 파싱
          let parsedData;
          try {
            parsedData = JSON.parse(data);
          } catch (e) {
            parsedData = data; // JSON이 아닐 경우 그대로 사용
          }

          // 메시지를 상태에 추가
          if (parsedData != "start") {
            setMessages(parsedData);
          }
        });

        // 에러 발생 시 연결 종료 후 3초 후 재연결
        eventSource.onerror = () => {
          console.log("EventSource error, attempting to reconnect...");
          eventSource.close();
          setTimeout(() => {
            createEventSource();
          }, 3000);
        };

        return eventSource;
      };

      // EventSource 생성 및 관리
      const eventSourceInstance = createEventSource();

      return () => {
        console.log("Closing EventSource connection...");
        eventSourceInstance.close();
      };
    }
  }, []);

  // 메인 사용자가 설정한 시간에 서브 계정의 차단 프로세스, sse 메세지가 올 때 시작
  useEffect(() => {
    if (user && messages) {
      if (!user.isRoot) {
        const startHiking = async () => {
          if (isRunning) {
            bgActions.setBackground("loft");
            try {
              if (isRunningRef.current) {
                setRemainTime(0);
                console.log("자동종료 로직 작동");
                // 종료 커스텀 이벤트 발생시키기
                const hikingEnd = new CustomEvent("hikingEnd", {
                  bubbles: true,
                  detail: { startedHikingId: hikingIdRef.current },
                });
                const endBtn = document.getElementById("mini");
                if (endBtn) {
                  endBtn.dispatchEvent(hikingEnd);
                }
                // 상태 업데이트
                setIsRunning(false);
                runningActions.setRunning(false);
              }
            } catch (err) {
              console.error("API 요청 중 오류 발생:", err);

              // SweetAlert를 사용하여 오류 메시지 표시
              Swal.fire({
                title: "하이킹을 종료하는 데 실패했습니다.",
                customClass: {
                  popup: "custom-swal-popup",
                },
                text: `오류 내용: ${
                  err.response?.data?.message || err.message
                }`,
                icon: "error",
                confirmButtonColor: "#03c777",
                confirmButtonText: "확인",
              });
            }
          }
          try {
            // 시작 시간 포맷 생성
            const now = new Date();
            const year = now.getFullYear();
            const month = now.getMonth() + 1;
            const day = now.getDate();
            const hour = now.getHours();
            const minute = now.getMinutes();
            const second = now.getSeconds();

            const format = `${year}-${("00" + month.toString()).slice(-2)}-${(
              "00" + day.toString()
            ).slice(-2)} ${("00" + hour.toString()).slice(-2)}:${(
              "00" + minute.toString()
            ).slice(-2)}:${("00" + second.toString()).slice(-2)}`;

            const startHikingData = {
              startTime: format,
              attentionTime: messages.attentionTime,
              isSelf: false,
            };
            console.log("보낼 바디 :", startHikingData);

            // API 요청
            const responseStartHiking = await hikingsApi.post(
              "",
              startHikingData
            );

            // 상태 업데이트
            bgActions.setBackground("mountain");
            setStartedHikingId(responseStartHiking.data.data.hikingId);
            setTotalTime(messages.attentionTime * 60);
            setRemainTime(messages.attentionTime * 60); // 분 단위로 받은 시간을 초로 변환
            setIsSelf(false);

            // 커스텀 이벤트 발생
            const hikingStart = new CustomEvent("hikingStart", {
              bubbles: true,
              detail: {
                startedHikingId: responseStartHiking.data.data.hikingId,
                selectedPreset: messages,
                backUrl: hikingsApi.defaults.baseURL,
                isRoot: user.isRoot ? "root" : "child",
              },
            });
            const startBtn = document.getElementById("start");
            startBtn?.dispatchEvent(hikingStart);
            startTimer(messages.attentionTime * 60);
            navigate("/");
          } catch (err) {
            console.error("API 요청 중 오류 발생:", err);

            // SweetAlert를 사용하여 오류 메시지 표시
            Swal.fire({
              title: "하이킹을 시작하는 데 실패했습니다.",
              customClass: {
                popup: "custom-swal-popup",
              },
              text: `오류 내용: ${err.response?.data?.message || err.message}`,
              icon: "error",
              confirmButtonColor: "#03c777",
              confirmButtonText: "확인",
            });
          }
        };

        // 함수 호출
        Swal.fire({
          title: "곧 하이킹이 시작됩니다!",
          text: "10초 후 자동으로 시작됩니다.",
          backdrop: "rgba(0,0,0,0.9)",
          timer: 10000, // 10초 타이머
          timerProgressBar: true,
          customClass: {
            popup: "custom-swal-popup",
          },
          didOpen: () => {
            bgActions.setBackground("mountain");

            Swal.showLoading();
          },
          willClose: () => {
            // 모달이 닫힐 때 추가 로직 필요 시 여기에 작성
            startHiking();
          },
        });
      }
      console.log("messages : ", messages);
      setMessages(null);
    }
  }, [messages]);

  const handleExtensionMemoMessage = async (data) => {
    // 익스텍션에서 받은 메모 저장
    console.log("handleExtensionMemoMessage: ", data);
    // setExtensionMemoData(data);
    createPostMemo(data);
  };

  const createPostMemo = async (data) => {
    try {
      // 프리셋 생성 Post 요청을 보내기
      // Request Body 데이터 가공
      console.log("받고싶은 데이터 data", data);
      console.log("받고싶은 데이터 data의 타이틀", data.title);
      console.log("받고싶은 데이터 data컨텐츠", data.content);
      const requestData = {
        title: data.title,
        content: data.content,
      };
      const response = await memosApi.post(``, requestData);
      console.log("CreateMemoPostApi: ", response.data);
    } catch (error) {
      console.error("Error create Memo:", error);
      throw error;
    }
  };

  const handleExtensionUrlMessage = async (data) => {
    // 익스텍션에서 받은 url 저장
    console.log("handleExtensionurlMessage: ", data);
    // setExtensionMemoData(data);
    addUrlPost(data);
  };

  const addUrlPost = async (data) => {
    try {
      // 프리셋 단일 추가 Post 요청을 보내기
      // Request Body 데이터 가공
      console.log("받고싶은 데이터 data", data);
      console.log("데이터 data 프리셋 아이디", data.presetId);
      console.log("받고싶은 데이터 data url", data.url);
      const requestData = {
        url: data.url,
      };
      const response = await presetsApi.post(`${data.presetId}`, requestData);
      // 커스텀 이벤트 발생시키기
      const sendUrlList = new CustomEvent("sendUrlList", {
        bubbles: true,
        detail: { urlList: response.data.data.blockWebsiteArray },
      });
      const clockDiv = document.getElementById("clock");
      clockDiv.dispatchEvent(sendUrlList);
    } catch (error) {
      console.error("Error addurl:", error);
      throw error;
    }
  };

  // onWebSocketMessage 이벤트 리스너 등록
  useEffect(() => {
    workerRef.current = new Worker(new URL("./worker.js", import.meta.url));
    workerRef.current.onmessage = (e) => {
      if (e.data.type === "step") {
        setRemainTime((prev) => prev - 1);
      } else if (e.data.type === "end") {
        try {
          bgActions.setBackground("loft");

          if (isRunningRef.current) {
            setRemainTime(0);
            console.log("자동종료 로직 작동");
            // 종료 커스텀 이벤트 발생시키기
            const hikingEnd = new CustomEvent("hikingEnd", {
              bubbles: true,
              detail: { startedHikingId: hikingIdRef.current },
            });
            const endBtn = document.getElementById("mini");
            if (endBtn) {
              endBtn.dispatchEvent(hikingEnd);
            }
            // 상태 업데이트
            setIsRunning(false);
            runningActions.setRunning(false);
          }
        } catch (err) {
          console.error("API 요청 중 오류 발생:", err);

          // SweetAlert를 사용하여 오류 메시지 표시
          Swal.fire({
            title: "하이킹을 종료하는 데 실패했습니다.",
            customClass: {
              popup: "custom-swal-popup",
            },
            text: `오류 내용: ${err.response?.data?.message || err.message}`,
            icon: "error",
            confirmButtonColor: "#03c777",
            confirmButtonText: "확인",
          });
        }
      }
    };

    window.electronAPI.onAllDone(allDone);

    // 이벤트 리스너 등록
    window.electronAPI.onSaveMemo(handleExtensionMemoMessage);

    window.electronAPI.onAddUrl(handleExtensionUrlMessage);

    window.electronAPI.onWebSocketConnect((type) => {
      console.log(type);
      if (type === "connect") {
        console.log("WebSocket Connect!!!", isConnectedRef.current);
        setIsConnected(true);
      } else if (type === "disconnect") {
        console.log("WebSocket Disconnect!!!", isConnectedRef.current);
        setIsConnected(false);
      }
    });

    presetsApi
      .get("")
      .then((result) => {
        setTimerPresetList(result.data.data.presetList);
      })
      .catch();

    startNow();
    return () => {
      workerRef.current.terminate();
    };
  }, []);

  useEffect(() => {
    console.log("isRunning : ", isRunning);
  }, [isRunning]);

  // 포기 버튼 누르기
  const handleGiveup = () => {
    Swal.fire({
      title: `진행중인 하이킹을 \n 포기하시겠습니까?`,
      customClass: {
        popup: "custom-swal-popup",
      },
      showDenyButton: true,
      confirmButtonColor: "#f40000",
      denyButtonColor: "#c5c5c5",
      confirmButtonText: "포기하기",
      denyButtonText: "취소",
      preConfirm: async () => {
        bgActions.setBackground("loft");
        try {
          console.log("취소 로직 작동");
          if (isRunning) {
            // 종료 커스텀 이벤트 발생시키기
            const hikingEnd = new CustomEvent("hikingEnd", {
              bubbles: true,
              detail: { startedHikingId },
            });
            const endBtn = document.getElementById("giveup");
            endBtn.dispatchEvent(hikingEnd);

            // 상태 업데이트
            pauseTimer(); // 분 단위로 받은 시간을 초로 변환
            setRemainTime(null);
            setIsRunning(false);
            setSelectedOption(null);
            runningActions.setRunning(false);
          }
        } catch (err) {
          console.error("API 요청 중 오류 발생:", err);

          // SweetAlert를 사용하여 오류 메시지 표시
          Swal.fire({
            title: "하이킹을 종료하는 데 실패했습니다.",
            customClass: {
              popup: "custom-swal-popup",
            },
            text: `오류 내용: ${err.response?.data?.message || err.message}`,
            icon: "error",
            confirmButtonColor: "#03c777",
            confirmButtonText: "확인",
          });
        }
      },
    });
  };
  // 다 됐을떄
  const allDone = (data) => {
    console.log("allDone", data);
  };

  // 최소화버튼 클릭
  const handleSmall = () => {
    const timerDiv = document.getElementById("timer");
    if (isSmall) {
      timerDiv.classList.remove("hidden");
      setIsSmall(false);
    } else {
      timerDiv.classList.add("hidden");
      setIsSmall(true);
    }
  };

  return (
    <>
      <style>
        {/* 타이머 시계 css */}
        {`
        .timer {
          background: ${
            isRunning
              ? "-webkit-linear-gradient(left, #333333 50%, #d10000 50%)"
              : "#eee"
          };
          border-radius: 100%;
          position: relative;
          height: 100%;
          width: 100%;
          transform: rotate(${
            isRunning ? `${(1 - remainTime / totalTime) * 360}deg` : "180deg"
          });
        }

        .mask {
          border-radius: 100% 0 0 100% / 50% 0 0 50%;
          height: 100%;
          position: absolute;
          left: ${isRunning ? `${remainTime >= totalTime / 2 ? 0 : "50%"}` : 0};
          top: 0;
          width: 50%;
          background: ${
            isRunning
              ? `${remainTime >= totalTime / 2 ? "#d10000" : "#333333"}`
              : "#eee"
          };
          transform-origin: 50% 50%;
          transform: rotate(${
            isRunning ? `${remainTime / totalTime >= 0.5 ? 0 : 180}deg` : "0deg"
          }) !important;
        }
        .hour-hand, .minute-hand {
          position: absolute;
          background-color: black;
          transform-origin: bottom;
          left: 50%;
          bottom: 50%;
        }
        .hour-hand {
          width: 4px;
          height: 30%;
          transform: rotate(${(new Date().getHours() % 12) * 30}deg);
          border-radius: 50px;
          background: linear-gradient(180deg, #86C8E3 0%, #263439 100%);
          box-shadow: 0px 0px 15px 3px #7FBFDA;
        }
        .minute-hand {
          width: 2px;
          height: 45%;
          transform: rotate(${new Date().getMinutes() * 6}deg);
          transfrom: translateY(-50%);
          border-radius: 50px;
          background: linear-gradient(180deg, #86C8E3 0%, #263439 100%);
          box-shadow: 0px 0px 15px 3px #7FBFDA;
        }
        .middle {
          position: absolute;
          left: 50%;
          top: 50%;
          width: 15px;
          height: 15px;
          border-radius: 100%;
          transform: translate(-50%, -50%);
          background: radial-gradient(circle, #c5c5c5 0%, #86c8e3 10%, #263439 100%);
          box-shadow: 0px 0px 15px 3px #7FBFDA;
        }
        input[type="number"]::-webkit-outer-spin-button,
        input[type="number"]::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
      `}
      </style>
      <div
        id="mini"
        className="absolute flex justify-end right-[3vw] top-[1vh] my-[2vh] z-[11]"
      >
        {isSmall && (
          <div
            className={`me-4 text-5xl font-bold text-${
              isRunning ? "[#d10000]" : "white"
            }`}
          >
            {isRunning
              ? formatTime(remainTime)
              : `${("00" + now.getHours().toString()).slice(-2)}:${(
                  "00" + now.getMinutes().toString()
                ).slice(-2)}`}
          </div>
        )}
        <div
          className={`flex flex-col items-end text-${
            isSmall ? "end" : "center"
          }`}
        >
          <button
            onClick={handleSmall}
            className="rounded-full bg-[#66aadf] w-[5vh] h-[5vh] flex justify-center items-center text-2xl text-white shadow-[2px_4px_3px_rgba(0,0,0,0.5)] hover:!shadow-[5px_6px_3px_rgba(0,0,0,0.5)] active:!shadow-[inset_2px_4px_3px_rgba(0,0,0,0.5)] transition-all duration-200"
          >
            <MdAccessTimeFilled />
          </button>
          <p className="text-white font-bold mt-2">
            {isSmall ? "타이머 표시" : "축소하기"}
          </p>
        </div>
      </div>
      <div
        id="timer"
        className="absolute z-10 w-[28%] h-[96%] right-0 bg-[#333333] bg-opacity-90 flex flex-col items-center rounded-lg my-[2vh] mx-[2vw]"
      >
        <div className="w-[40vh] h-[40vh] relative top-[15%]">
          <div className="relative h-[100%] w-[100%]">
            <div className="timer overflow-hidden"></div>
            <div className="mask"></div>
          </div>
          <div
            id="clock"
            className={`absolute top-[70%] left-[50%] translate-x-[-50%] remain text-3xl text-${
              isRunning ? "white" : "black"
            } font-bold`}
          >
            {isRunning
              ? formatTime(remainTime)
              : `${("00" + now.getHours().toString()).slice(-2)}:${(
                  "00" + now.getMinutes().toString()
                ).slice(-2)}`}
          </div>
          {!isRunning && (
            <>
              <div className="hour-hand"></div>
              <div className="minute-hand"></div>
              <div className="middle z-10 bg-[#66AADF]"></div>
            </>
          )}
          {!isRunning && (
            <div className="flex flex-col mt-[15%] items-center">
              <input
                id="hikingStart"
                type="number"
                value={inputTime}
                onChange={(e) => setInputTime(e.target.value)}
                className="w-[60%] hover:border-[#66AADF] rounded-xl text-lg"
                placeholder="하이킹 시간을 입력해주세요"
              />
              <label htmlFor="hikingStart" className="text-md text-white">
                *분 단위로 입력해주세요.<br></br>최소 30분부터 240분까지
                가능합니다.
              </label>
              {user && user.isRoot && (
                <>
                  <div
                    tabIndex={0}
                    className={`mt-5 relative w-[60%] h-[60%] rounded-lg bg-white border border-gray-300 px-3 py-2 cursor-pointer ${
                      isOpen ? "focus:ring-4 focus:ring-[#66aadf]" : ""
                    }`}
                  >
                    <div
                      onClick={() => setIsOpen(!isOpen)}
                      className="flex justify-between items-center"
                    >
                      <p>
                        {selectedOption
                          ? selectedOption.title
                          : "프리셋을 선택하세요."}
                      </p>
                      <IoIosArrowDown />
                    </div>
                    {isOpen && (
                      <ul
                        className="absolute left-0 right-0 mt-3 bg-white border
                      border-gray-300 rounded-lg shadow-lg"
                      >
                        {timerPresetList.map((preset, index) => (
                          <div key={preset.presetId}>
                            <li
                              onClick={() => {
                                setSelectedOption(preset);
                                setIsOpen(false);
                              }}
                              className="px-3 py-2 hover:bg-[#66aadf] cursor-pointer rounded-lg hover:font-bold"
                            >
                              {preset.title}
                            </li>
                            {index < timerPresetList.length - 1 && (
                              <hr className="border-gray-200" />
                            )}
                          </div>
                        ))}
                      </ul>
                    )}
                  </div>
                  <label htmlFor="" className="text-sm text-white">
                    *적용할 프리셋을 선택해주세요.
                  </label>
                </>
              )}
              <div className="flex w-full mt-3">
                <div
                  className={`flex justify-center items-center w-[4vh] h-[4vh] ms-5 rounded-full font-bold text-white text-2xl ${
                    isConnected ? "bg-[#03c777]" : "bg-[#ff7f00]"
                  }`}
                >
                  {isConnected ? <FaCheck /> : <AiOutlineDisconnect />}
                </div>
                <div
                  className={`flex items-center justify-center ${
                    isConnected ? "text-[#03c777]" : "text-[#ff7f00]"
                  } text-xl ms-3 font-bold`}
                >
                  {isConnected
                    ? "확장프로그램과 연결된 상태입니다!"
                    : "확장프로그램과 연결이 필요합니다!"}
                </div>
              </div>
              <button
                className="w-[10vw] h-[6vh] mt-5 rounded-xl text-white text-xl  font-bold bg-[#03c777]"
                onClick={handleStart}
                id="start"
              >
                시작
              </button>
            </div>
          )}
          {isRunning && isSelf && (
            <div className="flex flex-col mt-[15%] items-center">
              <button
                className="w-[10vw] h-[6vh] mt-[10%] rounded-xl text-white bg-[#f40000]"
                onClick={handleGiveup}
                id="giveup"
              >
                포기하기
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Timer;

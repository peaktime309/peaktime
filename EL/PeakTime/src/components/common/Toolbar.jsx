import { useNavigate } from "react-router-dom";
import { FaHiking } from "react-icons/fa";
import { HiOutlinePresentationChartLine } from "react-icons/hi2";
import { MdStickyNote2 } from "react-icons/md";
import { BiShieldQuarter } from "react-icons/bi";
import { FaHandsHoldingChild } from "react-icons/fa6";
import { AiFillHome, AiFillSetting } from "react-icons/ai";
import { Tooltip } from "flowbite-react";
import { useEffect, useState } from "react";
import { useUserStore } from "../../stores/UserStore";
import Swal from "sweetalert2"; // 모달 라이브러리
import "../../styles/daily-report-custom-swal.css";
import usersApi from "../../api/usersApi";
import authApi from "../../api/authApi";
import { useRunningStore } from "../../stores/RunningStore";

function Toolbar() {
  const navigate = useNavigate();
  //유저정보
  const { user, userActions } = useUserStore();
  const localUser = JSON.parse(localStorage.getItem("user")) || null;
  // 하이킹 진행중 정보
  const { running, runningActions } = useRunningStore();
  useEffect(() => {
    console.log("Running state changed:", running);
  }, [running]);
  // 버튼 스타일 조건을 위한 변수
  const [isHomeHovered, setIsHomeHovered] = useState(false);
  const [isSettingHovered, setIsSettingHovered] = useState(false);
  const [activeSetting, setActiveSetting] = useState(false);

  // 회원정보 관리 페이지 접근 권한 검사 모달창 띄우기
  const checkAccessModal = async () => {
    const { value: getPassword } = await Swal.fire({
      title: "사용자 정보 확인",
      html: "개인정보 수정을 위해 인증이 필요합니다.<br>비밀번호를 입력해주세요.",
      customClass: {
        popup: "custom-swal-popup",
        input: "custom-swal-input",
      },
      input: "password",
      confirmButtonColor: "#03C777",
      confirmButtonText: "확인",
      showCancelButton: true,
      cancelButtonText: "취소",
      cancelButtonColor: "#F40000",
      icon: "question",
      inputAttributes: {
        placeholder: "password",
        style: "color: black;", // input 텍스트 색상
      },
    });

    // 이후 처리되는 내용
    if (getPassword) {
      checkAccess(getPassword);
    }
  };

  // 회원정보 관리 페이지 접근 권한 검사 API 호출
  const checkAccess = async (getPassword) => {
    const checkAccessData = {
      password: getPassword,
    };
    try {
      await usersApi.post("/settings", checkAccessData);
      // 성공하면 이어서 진행
      handleMenu("/usersetting");
    } catch (error) {
      // 실패하면 여기로 진입
      console.error(error);
      Swal.fire({
        title: "다시 시도해주세요.",
        customClass: {
          popup: "custom-swal-popup",
        },
        text: "비밀번호가 일치하지 않습니다.",
        icon: "error",
        confirmButtonColor: "#03C777",
        confirmButtonText: "확인",
      });
    }
  };

  //이동 함수
  const handleMenu = (type) => {
    if (type === "/preset" && running) {
      Swal.fire({
        title: "하이킹 중 접근 불가",
        customClass: {
          popup: "custom-swal-popup",
        },
        text: "하이킹 중에는 차단 관리에 접근할 수 없습니다.",
        icon: "error",
        confirmButtonColor: "#03C777",
        confirmButtonText: "확인",
      });
    } else {
      navigate(type);
    }
  };

  // 로그아웃 검사 모달창 띄우기
  const logoutModal = async () => {
    const { value: getRootUserPassword } = await Swal.fire({
      title: "로그아웃",
      html: "로그아웃을 위해 메인 계정의 비밀번호를 입력해주세요.",
      customClass: {
        popup: "custom-swal-popup",
        input: "custom-swal-input",
      },
      icon: "question",
      input: "password",
      confirmButtonColor: "#03C777",
      confirmButtonText: "확인",
      showCancelButton: true,
      cancelButtonText: "취소",
      cancelButtonColor: "#F40000",
      inputAttributes: {
        placeholder: "password",
        style: "color: black;", // input 텍스트 색상
      },
    });

    // 이후 처리되는 내용
    if (getRootUserPassword) {
      logout(getRootUserPassword);
    }
  };

  // 로그아웃 API 호출
  const logout = async (getRootUserPassword) => {
    // 로그아웃은 auth이지만 유일하게 access Token이 필요
    const logoutData = {
      rootUserPassword: getRootUserPassword,
    };
    try {
      const { user } = useUserStore.getState();
      const accessToken = user.accessToken;
      await authApi.post("/logout", logoutData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      // 성공하면 이어서 진행
      browserLogout();
    } catch (error) {
      // 실패하면 여기로 진입
      console.error(error);
      Swal.fire({
        title: "비밀번호 불일치",
        customClass: {
          popup: "custom-swal-popup",
        },
        text: "비밀번호가 일치하지 않습니다.",
        icon: "error",
        confirmButtonColor: "#03C777",
        confirmButtonText: "확인",
      });
    }
  };

  // 브라우저 로그아웃
  const browserLogout = () => {
    localStorage.removeItem("user");
    userActions.setUser(null);
    localStorage.removeItem("user");
    userActions.setUser(null);
    localStorage.removeItem("user");
  };

  // 비밀번호 변경 모달창 띄우기
  const changePasswordModal = async () => {
    const { value: getPassword } = await Swal.fire({
      title: "사용자 정보 확인",
      html: "비밀번호 수정을 위해 인증이 필요합니다.<br>비밀번호를 입력해주세요.",
      customClass: {
        popup: "custom-swal-popup",
        input: "custom-swal-input",
      },
      icon: "question",
      input: "password",
      confirmButtonColor: "#03C777",
      confirmButtonText: "확인",
      showCancelButton: true,
      cancelButtonText: "취소",
      cancelButtonColor: "#F40000",
      inputAttributes: {
        placeholder: "password",
        style: "color: black;", // input 텍스트 색상
      },
    });

    // 이후 처리되는 내용
    if (getPassword) {
      checkPassword(getPassword);
    }
  };

  // 비밀번호 검증 API 호출
  const checkPassword = async (getPassword) => {
    const checkPasswordData = {
      password: getPassword,
    };
    try {
      await usersApi.post("/password", checkPasswordData);
      // 성공하면 이어서 진행
      handleMenu("/passwordchange");
    } catch (error) {
      // 실패하면 여기로 진입
      console.error(error);
      Swal.fire({
        title: "비밀번호 불일치",
        customClass: {
          popup: "custom-swal-popup",
        },
        text: "비밀번호가 일치하지 않습니다.",
        icon: "error",
        confirmButtonColor: "#03C777",
        confirmButtonText: "확인",
      });
    }
  };

  // 종료 모달창 띄우기
  const quitModal = async () => {
    const { value: getRootUserPassword } = await Swal.fire({
      title: "종료",
      html: "종료를 위해 메인 계정의 비밀번호를 입력해주세요.",
      customClass: {
        popup: "custom-swal-popup",
        input: "custom-swal-input",
      },
      icon: "question",
      input: "password",
      confirmButtonColor: "#03C777",
      confirmButtonText: "확인",
      showCancelButton: true,
      cancelButtonText: "취소",
      cancelButtonColor: "#F40000",
      inputAttributes: {
        placeholder: "password",
        style: "color: black;", // input 텍스트 색상
      },
    });

    // 이후 처리되는 내용
    if (getRootUserPassword) {
      check(getRootUserPassword);
    }
  };

  const check = async (getRootUserPassword) => {
    // 로그아웃은 auth이지만 유일하게 access Token이 필요
    // 로그아웃 api는 메인 계정 비밀번호를 검증하는 역할이므로 재사용 가능
    const logoutData = {
      rootUserPassword: getRootUserPassword,
    };
    try {
      const { user } = useUserStore.getState();
      const accessToken = user.accessToken;
      await authApi.post("/logout", logoutData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      // 성공하면 이어서 진행
      quit();
    } catch (error) {
      // 실패하면 여기로 진입
      console.error(error);
      Swal.fire({
        title: "비밀번호 불일치",
        customClass: {
          popup: "custom-swal-popup",
        },
        text: "비밀번호가 일치하지 않습니다.",
        icon: "error",
        confirmButtonColor: "#03C777",
        confirmButtonText: "확인",
      });
    }
  };

  const quit = () => {
    // Electron의 quit 메서드 호출
    if (window.electronAPI && window.electronAPI.quit) {
      window.electronAPI.quit();
    } else {
      console.error("Electron API is not available.");
    }
  };

  return (
    <div className="bg-[#66aadf] w-[8vw] h-[100vh] absolute left-0 z-[2] flex flex-col items-center justify-between">
      <div className="flex flex-col h-[70%] justify-around">
        <Tooltip
          content="하이킹 내역"
          placement="right"
          className="whitespace-nowrap font-bold text-2xl"
        >
          <div className="relative flex justify-center">
            <button
              onClick={() => {
                handleMenu("/report");
              }}
              className="bg-gray-100 hover:bg-white active:bg-gray-200 w-[10vh] h-[10vh] rounded-full flex items-start pt-6 justify-center text-4xl shadow-[2px_4px_3px_rgba(0,0,0,0.5)] hover:!shadow-[5px_6px_3px_rgba(0,0,0,0.5)] active:!shadow-[inset_2px_4px_3px_rgba(0,0,0,0.5)] transition-all duration-200"
            >
              <FaHiking />
              <p className="absolute top-[65%] text-sm font-bold">
                하이킹 내역
              </p>
            </button>
          </div>
        </Tooltip>
        <Tooltip
          content="전체 통계"
          placement="right"
          className="whitespace-nowrap font-bold text-2xl"
        >
          <div className="relative flex justify-center">
            <button
              onClick={() => {
                handleMenu("/statistic");
              }}
              className="bg-gray-100 hover:bg-white active:bg-gray-200 w-[10vh] h-[10vh] rounded-full flex items-start pt-6 justify-center text-4xl shadow-[2px_4px_3px_rgba(0,0,0,0.5)] hover:!shadow-[5px_6px_3px_rgba(0,0,0,0.5)] active:!shadow-[inset_2px_4px_3px_rgba(0,0,0,0.5)] transition-all duration-200"
            >
              <HiOutlinePresentationChartLine />
              <p className="absolute top-[65%] text-sm font-bold">전체 통계</p>
            </button>
          </div>
        </Tooltip>
        <Tooltip
          content="메모"
          placement="right"
          className="whitespace-nowrap font-bold text-2xl"
        >
          <div className="absolute z-10 w-[32px] h-[32px]">
            <img
              src="../../../public/assets/chrome.svg"
              className="w-full h-full"
            />
          </div>
          <div className="relative flex justify-center">
            <button
              onClick={() => {
                handleMenu("/memo");
              }}
              className="bg-gray-100 hover:bg-white active:bg-gray-200 w-[10vh] h-[10vh] rounded-full flex items-start pt-6 justify-center text-4xl shadow-[2px_4px_3px_rgba(0,0,0,0.5)] hover:!shadow-[5px_6px_3px_rgba(0,0,0,0.5)] active:!shadow-[inset_2px_4px_3px_rgba(0,0,0,0.5)] transition-all duration-200"
            >
              <MdStickyNote2 />
              <p className="absolute top-[65%] text-sm font-bold">메모</p>
            </button>
          </div>
        </Tooltip>
        {localUser && localUser.isRoot && (
          <>
            <Tooltip
              content="차단 관리"
              placement="right"
              className="whitespace-nowrap font-bold text-2xl"
            >
              <div className="relative flex justify-center">
                <button
                  onClick={() => {
                    handleMenu("/preset");
                  }}
                  className="bg-gray-100 hover:bg-white active:bg-gray-200 w-[10vh] h-[10vh] rounded-full flex items-start pt-6 justify-center text-4xl shadow-[2px_4px_3px_rgba(0,0,0,0.5)] hover:!shadow-[5px_6px_3px_rgba(0,0,0,0.5)] active:!shadow-[inset_2px_4px_3px_rgba(0,0,0,0.5)] transition-all duration-200 "
                >
                  <BiShieldQuarter />
                  <p className="absolute top-[65%] text-sm font-bold">
                    차단 관리
                  </p>
                </button>
              </div>
            </Tooltip>
            <Tooltip
              content="서브계정 관리"
              placement="right"
              className="whitespace-nowrap font-bold text-2xl"
            >
              <div className="relative flex justify-center">
                <button
                  onClick={() => {
                    handleMenu("/children");
                  }}
                  className="bg-gray-100 hover:bg-white active:bg-gray-200 w-[10vh] h-[10vh] rounded-full flex items-start pt-6 justify-center text-4xl shadow-[2px_4px_3px_rgba(0,0,0,0.5)] hover:!shadow-[5px_6px_3px_rgba(0,0,0,0.5)] active:!shadow-[inset_2px_4px_3px_rgba(0,0,0,0.5)] transition-all duration-200"
                >
                  <FaHandsHoldingChild />
                  <p className="absolute top-[65%] text-sm font-bold">
                    서브계정 관리
                  </p>
                </button>
              </div>
            </Tooltip>
          </>
        )}
      </div>
      <div className="flex flex-col h-[20%] justify-around">
        <Tooltip
          content="홈"
          placement="right"
          className="whitespace-nowrap font-bold text-2xl"
        >
          <button
            onClick={() => {
              handleMenu("/");
            }}
            className="text-white text-5xl"
          >
            <AiFillHome
              style={{
                filter: isHomeHovered
                  ? "drop-shadow(5px 5px 15px rgba(0, 0, 0, 0.5))"
                  : "drop-shadow(2px 4px 3px rgba(0, 0, 0, 0.5))", // 이 부분을 filter 속성 내에서 적용
                transition: "filter 0.3s ease",
              }}
              onMouseEnter={() => setIsHomeHovered(true)}
              onMouseLeave={() => setIsHomeHovered(false)}
            />
          </button>
        </Tooltip>
        <Tooltip
          content={
            <div className="flex flex-col">
              {localUser && localUser.isRoot && (
                <>
                  <button onClick={checkAccessModal} className="text-left">
                    유저정보수정
                  </button>
                  <hr className="border-t my-1 border-gray-300" />
                </>
              )}
              <button onClick={changePasswordModal} className="text-left">
                비밀번호 변경
              </button>
              <hr className="border-t my-1 border-gray-300" />
              <button onClick={logoutModal} className="text-left">
                로그아웃
              </button>
              <hr className="border-t my-1 border-gray-300" />
              <button onClick={quitModal} className="text-left">
                종료
              </button>
            </div>
          }
          placement="right"
          className="whitespace-nowrap font-bold text-2xl"
        >
          <button className="text-white text-5xl">
            <AiFillSetting
              style={{
                filter: isSettingHovered
                  ? "drop-shadow(5px 5px 15px rgba(0, 0, 0, 0.5))"
                  : "drop-shadow(2px 4px 3px rgba(0, 0, 0, 0.5))", // 이 부분을 filter 속성 내에서 적용
                transition: "filter 0.3s ease",
              }}
              onMouseEnter={() => setIsSettingHovered(true)}
              onMouseLeave={() => setIsSettingHovered(false)}
            />
          </button>
        </Tooltip>
      </div>
    </div>
  );
}

export default Toolbar;

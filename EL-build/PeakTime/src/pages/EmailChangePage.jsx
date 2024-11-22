import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // 모달 라이브러리
import "../styles/daily-report-custom-swal.css";
import { useEffect, useState } from "react";
import authApi from "../api/authApi";
import usersApi from "../api/usersApi";

function EmailChangePage() {
  // 라우팅 설정
  const navigate = useNavigate();

  // 입력 변수 (for 양방향 바인딩)
  const [inputEmail, setInputEmail] = useState("");
  const [inputCode, setInputCode] = useState("");

  // 경고 문구
  const [emailAlertMessage, setEmailAlertMessage] = useState("");
  const [codeAlertMessage, setCodeAlertMessage] = useState("");

  // 변수 상태 -> 전부 true가 되어야 `이메일 변경완료` 버튼 활성화
  const [emailFormatIsOK, setEmailFormatIsOK] = useState(false);
  const [emailDuplicationIsOK, setEmailDuplicationIsOK] = useState(false); // 주의할 것 : true이면 중복 X
  const [emailSendingIsOK, setEmailSendingIsOK] = useState(false);
  const [emailCodeIsValid, setEmailCodeIsValid] = useState(false);

  // 색상과 관련된 변수 상태 필요
  const [emailAlertMessageColor, setEmailAlertMessageColor] = useState(false);

  // Email placeholder 관련 (이메일이 변경될 때마다 이전으로 되돌아가므로 현재 컴포넌트가 마운트 될 때만 조회하면 된다.)
  const [emailPlaceholder, setEmailPlaceholder] = useState("");

  useEffect(() => {
    // inputEmail 입력시 처리 로직
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (emailRegex.test(inputEmail)) {
      setEmailFormatIsOK(true);
      setEmailAlertMessage("이메일 중복 확인을 진행해주세요.");
      setEmailAlertMessageColor(true);
    } else {
      setEmailFormatIsOK(false);
      setEmailAlertMessage("이메일 형식에 맞지 않습니다.");
      setEmailAlertMessageColor(false);
      if (!inputEmail) {
        // 입력값이 아무것도 없다면 경고 문구도 띄우지 않는다.
        setEmailAlertMessage("");
      }
    }
    setEmailDuplicationIsOK(false);
    setEmailSendingIsOK(false);
    setEmailCodeIsValid(false);
    setCodeAlertMessage("");
  }, [inputEmail])

  useEffect(() => {
    getProfile();
  }, [])

  // 프로필 조회 API 호출
  const getProfile = async () => {
    try {
      const getProfileResponse = await usersApi.get("");
      // 성공하면 이어서 진행
      setEmailPlaceholder(getProfileResponse.data.data.email);
    } catch (error) {
      // 실패하면 여기로 진입
      Swal.fire({
        title: "프로필 조회에 실패하였습니다. 다시 시도해주세요.",
        customClass: {
          popup: 'custom-swal-popup',
        },
        text: `${error.response.data.message}`,
        icon: "error",
        confirmButtonColor: "#03C777",
        confirmButtonText: "확인",
        didClose: () => navigate(-1),
      });
    }
  }

  // 이메일 중복 조회 API 호출
  const isDuplicatedEmail = async () => {
    setEmailSendingIsOK(false);
    setEmailCodeIsValid(false);
    setCodeAlertMessage("");
    const email = inputEmail;
    try {
      const isDuplicatedEmailResponse = await authApi.get("/email", {
        params: {
          email,
        }
      });
      // 성공하면 이어서 진행
      const isDuplicated = isDuplicatedEmailResponse.data.data.isDuplicated;
      if (isDuplicated) {
        // 이메일이 중복인 경우
        setEmailDuplicationIsOK(false);
        setEmailAlertMessage("이미 존재하는 이메일입니다.");
        setEmailAlertMessageColor(false);
        Swal.fire({
          title: "이미 존재하는 이메일입니다.",
          customClass: {
            popup: 'custom-swal-popup',
          },
          icon: "error",
          confirmButtonColor: "#03C777",
          confirmButtonText: "확인",
        });
      } else {
        // 이메일이 중복이 아닌 경우
        setEmailDuplicationIsOK(true);
        setEmailAlertMessage("사용 가능한 이메일입니다. 이메일 인증을 진행해주세요.");
        setEmailAlertMessageColor(true);
        Swal.fire({
          title: "사용 가능한 이메일입니다.",
          customClass: {
            popup: 'custom-swal-popup',
          },
          text: "이메일 인증을 진행해주세요.",
          icon: "success",
          confirmButtonColor: "#03C777",
          confirmButtonText: "확인",
        });
      }
    } catch (error) {
      // 에러가 발생하면 여기로 진입
      Swal.fire({
        title: "이메일 중복 조회 요청이 실패했습니다. 다시 시도해주세요.",
        customClass: {
          popup: 'custom-swal-popup',
        },
        text: `${error.response.data.message}`,
        icon: "error",
        confirmButtonColor: "#03C777",
        confirmButtonText: "확인",
      });
    }
  }

  // 이메일 인증 코드 전송 API 호출
  const sendCode = async () => {
    setEmailCodeIsValid(false);
    setCodeAlertMessage("");
    const sendCodeData = {
      email: inputEmail,
    };
    try {
      await authApi.post("/code/send", sendCodeData);
      // 성공하면 이어서 진행
      setEmailSendingIsOK(true);
      setEmailAlertMessage("인증 코드가 전송되었습니다.");
      setEmailAlertMessageColor(true);
      Swal.fire({
        title: "인증 코드가 전송되었습니다.",
        customClass: {
          popup: 'custom-swal-popup',
        },
        icon: "success",
        confirmButtonColor: "#03C777",
        confirmButtonText: "확인",
      });
    } catch (error) {
      // 에러가 발생하면 여기로 진입
      setEmailSendingIsOK(false);
      setEmailAlertMessage("인증 코드 전송에 실패했습니다. 다시 시도해주세요.");
      setEmailAlertMessageColor(false);
      Swal.fire({
        title: "인증 코드 전송에 실패했습니다. 다시 시도해주세요.",
        customClass: {
          popup: 'custom-swal-popup',
        },
        text: `${error.response.data.message}`,
        icon: "error",
        confirmButtonColor: "#03C777",
        confirmButtonText: "확인",
      });
    }
  }

  // 이메일 인증 코드 확인 API 호출
  const checkCode = async () => {
    const checkCodeData = {
      email: inputEmail,
      code: inputCode,
    };
    try {
      await authApi.post("/code/check", checkCodeData);
      // 성공하면 이어서 진행
      setEmailCodeIsValid(true);
      setCodeAlertMessage("이메일 인증에 성공하였습니다. 해당 이메일로 변경할 수 있습니다.");
      Swal.fire({
        title: "이메일 인증에 성공하였습니다.",
        customClass: {
          popup: 'custom-swal-popup',
        },
        text: "해당 이메일로 변경할 수 있습니다.",
        icon: "success",
        confirmButtonColor: "#03C777",
        confirmButtonText: "확인",
      });
    } catch (error) {
      // 실패하면 여기로 진입
      setEmailCodeIsValid(false);
      setCodeAlertMessage(error.response.data.message);
      Swal.fire({
        title: "다시 시도해주세요.",
        customClass: {
          popup: 'custom-swal-popup',
        },
        text: `${error.response.data.message}`,
        icon: "error",
        confirmButtonColor: "#03C777",
        confirmButtonText: "확인",
      });
    }
  }

  // 이메일 변경 API 호출
  const updateEmail = async () => {
    const updateEmailData = {
      email: inputEmail,
    };
    try {
      await usersApi.put("/email", updateEmailData);
      // 성공하면 이어서 진행
      Swal.fire({
        title: "이메일이 성공적으로 변경되었습니다.",
        customClass: {
          popup: 'custom-swal-popup',
        },
        text: "개인 설정 페이지로 되돌아갑니다.",
        icon: "success",
        confirmButtonColor: "#03C777",
        didClose: () => navigate(-1),
      });
    } catch (error) {
      // 실패하면 여기로 진입
      Swal.fire({
        title: "이메일 변경에 실패하였습니다. 다시 시도해주세요.",
        customClass: {
          popup: 'custom-swal-popup',
        },
        text: `${error.response.data.message}`,
        icon: "error",
        confirmButtonColor: "#03C777",
        confirmButtonText: "확인",
      });
    }
  }

  // 뒤로가기
  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="h-[100vh] flex justify-center items-center">
      <div className="w-[60vw] h-[70vh] flex flex-col justify-between items-center bg-[#333333] bg-opacity-90 p-5 rounded-lg text-white">
        <h1 className="text-[30px] font-bold">이메일 변경</h1>
        {/* 새 이메일 */}
        <div className="flex flex-col gap-3 justify-between w-[70%] relative">
          <div className="flex gap-3 text-start w-full relative">
            <div className="flex flex-col gap-3 w-[40%]">
              <label htmlFor="nickname" className="text-white font-bold">
                새 이메일
              </label>
              <input
                id="email"
                name="email"
                type="text"
                placeholder={emailPlaceholder}
                value={inputEmail}
                onChange={(e) => { setInputEmail(e.target.value); }}
                className="px-3 py-3 h-[100%] rounded-lg ps-3 bg-opacity-90 text-black font-bold"
              />
            </div>
            <button
              className="absolute left-[45%] bottom-0 bg-[#03c777] rounded-xl px-5 py-3 hover:bg-[#02a566] focus:ring-4 focus:ring-[#03c777] text-white font-bold "
              disabled={!emailFormatIsOK}
              onClick={isDuplicatedEmail}
            >
              중복 확인
            </button>
            <button
              className="absolute left-[60%] bottom-0 bg-[#03c777] rounded-xl px-5 py-3 hover:bg-[#02a566] focus:ring-4 focus:ring-[#03c777] text-white font-bold "
              disabled={!emailFormatIsOK || !emailDuplicationIsOK}
              onClick={sendCode}
            >
              인증코드 전송
            </button>
          </div>
          {/* 경고메시지 */}
          <div
            className={`absolute top-[115%] font-bold text-${emailAlertMessageColor ? "[#03c777]" : "[#f40000]"
              }`}
          >
            {emailAlertMessage}
          </div>
        </div>
        {/* 인증코드 확인 */}
        <div className="flex flex-col gap-3 justify-between w-[70%] relative">
          <div className="flex gap-3 text-start w-full relative">
            <div className="flex flex-col gap-3 w-[40%]">
              <label htmlFor="nickname" className="text-white font-bold">
                인증코드 확인
              </label>
              <input
                id="code"
                name="code"
                type="text"
                value={inputCode}
                onChange={(e) => { setInputCode(e.target.value); }}
                className="px-3 py-3 h-[100%] rounded-lg ps-3 bg-opacity-90 text-black font-bold"
              />
            </div>
            <button
              className="absolute left-[45%] bottom-0 bg-[#03c777] rounded-xl px-5 py-3 hover:bg-[#02a566] focus:ring-4 focus:ring-[#03c777] text-white font-bold "
              disabled={!emailFormatIsOK || !emailDuplicationIsOK || !emailSendingIsOK}
              onClick={checkCode}
            >
              확인
            </button>
          </div>
          {/* 경고메시지 */}
          <div
            className={`absolute top-[115%] font-bold text-${emailCodeIsValid ? "[#03c777]" : "[#f40000]"
              }`}
          >
            {codeAlertMessage}
          </div>
        </div>
        <div id="footerButton" className="flex gap-5">
          <button
            disabled={!emailFormatIsOK || !emailDuplicationIsOK || !emailSendingIsOK || !emailCodeIsValid}
            onClick={updateEmail}
            className="bg-[#03c777] rounded-xl px-5 py-2 hover:bg-[#02a566] focus:ring-4 focus:ring-[#03c777] text-white font-bold">
            이메일 변경하기
          </button>
          <button
            onClick={goBack}
            className="bg-[#7c7c7c] rounded-xl px-5 py-2 hover:bg-[#5c5c5c] focus:ring-4 focus:ring-[#c5c5c5] text-white font-bold">
            돌아가기
          </button>
        </div>
      </div>
    </div>
  );
}

export default EmailChangePage;

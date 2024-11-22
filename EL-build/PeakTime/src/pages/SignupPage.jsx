import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import authApi from "../api/authApi";
import Swal from "sweetalert2"; // 모달 라이브러리
import "../styles/daily-report-custom-swal.css";

function SignupPage() {
  // 라우팅 설정
  const navigate = useNavigate();

  // 입력 변수 (for 양방향 바인딩)
  const [inputId, setInputId] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const [inputConfirmPassword, setInputConfirmPassword] = useState("");
  const [inputNickname, setInputNickname] = useState("");
  const [inputEmail, setInputEmail] = useState("");
  const [inputCode, setInputCode] = useState("");

  // 경고 문구
  const [idAlertMessage, setIdAlertMessage] = useState("");
  const [passwordAlertMessage, setPasswordAlertMessage] = useState("");
  const [confirmPasswordAlertMessage, setConfirmPasswordAlertMessage] =
    useState("");
  const [nicknameAlertMessage, setNicknameAlertMessage] = useState("");
  const [emailAlertMessage, setEmailAlertMessage] = useState("");
  const [codeAlertMessage, setCodeAlertMessage] = useState("");

  // 변수 상태 -> 전부 true가 되어야 `가입완료` 버튼 활성화
  const [idFormatIsOK, setIdFormatIsOK] = useState(false);
  const [idDuplicationIsOK, setIdDuplicationIsOK] = useState(false); // 주의할 것 : true이면 중복 X
  const [nicknameFormatIsOK, setNicknameFormatIsOK] = useState(false);
  const [passwordFormatIsOK, setPasswordFormatIsOK] = useState(false);
  const [confirmPasswordFormatIsOK, setConfirmPasswordFormatIsOK] =
    useState(false);
  const [emailFormatIsOK, setEmailFormatIsOK] = useState(false);
  const [emailDuplicationIsOK, setEmailDuplicationIsOK] = useState(false); // 주의할 것 : true이면 중복 X
  const [emailSendingIsOK, setEmailSendingIsOK] = useState(false);
  const [emailCodeIsValid, setEmailCodeIsValid] = useState(false);

  // 색상과 관련된 변수 상태 필요
  const [idAlertMessageColor, setIdAlertMessageColor] = useState(false);
  const [emailAlertMessageColor, setEmailAlertMessageColor] = useState(false);

  // 입력시 처리 함수
  useEffect(() => {
    // inputId 입력시 처리 로직
    const idRegex = /^[a-zA-Z0-9]{5,15}$/;
    if (idRegex.test(inputId)) {
      setIdFormatIsOK(true);
      setIdAlertMessageColor(true);
      setIdAlertMessage("아이디 중복 확인을 진행해주세요.");
    } else {
      setIdFormatIsOK(false);
      setIdAlertMessageColor(false);
      setIdAlertMessage("* 5자 이상 15자 이하  * 영문, 숫자 사용 가능");
    }
    setIdDuplicationIsOK(false);
  }, [inputId]);

  useEffect(() => {
    // inputNickname 입력시 처리 로직
    const nicknameRegex = /^[가-힣a-zA-Z0-9]{2,15}$/;
    if (nicknameRegex.test(inputNickname)) {
      setNicknameFormatIsOK(true);
      setNicknameAlertMessage("사용 가능한 닉네임입니다.");
    } else {
      setNicknameFormatIsOK(false);
      setNicknameAlertMessage(
        "* 2자 이상 15자 이하  * 한글, 영문, 숫자 사용 가능"
      );
    }
  }, [inputNickname]);

  useEffect(() => {
    // inputPassword 입력시 처리 로직
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-\[\]{};':"\\|,.<>\/?])[A-Za-z\d!@#$%^&*()_+\-\[\]{};':"\\|,.<>\/?]{8,}$/;
    if (passwordRegex.test(inputPassword)) {
      setPasswordFormatIsOK(true);
      setPasswordAlertMessage("사용 가능한 비밀번호입니다.");
    } else {
      setPasswordFormatIsOK(false);
      setPasswordAlertMessage(
        `* 최소 8자 이상  * 영문 대문자, 영문 소문자, 숫자, 특수문자를 모두 포함`
      );
    }
  }, [inputPassword]);

  useEffect(() => {
    // inputConfirmPassword 입력시 처리 로직
    if (inputPassword === inputConfirmPassword && inputConfirmPassword) {
      setConfirmPasswordFormatIsOK(true);
      setConfirmPasswordAlertMessage("확인되었습니다.");
    } else {
      setConfirmPasswordFormatIsOK(false);
      setConfirmPasswordAlertMessage("비밀번호가 일치하지 않습니다.");
    }
  }, [inputConfirmPassword]);

  useEffect(() => {
    // inputEmail 입력시 처리 로직
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (emailRegex.test(inputEmail)) {
      setEmailFormatIsOK(true);
      setEmailAlertMessageColor(true);
      setEmailAlertMessage("이메일 중복 확인을 진행해주세요.");
    } else {
      setEmailFormatIsOK(false);
      setEmailAlertMessageColor(false);
      setEmailAlertMessage("* example@example.com");
    }
    setEmailDuplicationIsOK(false);
    setEmailSendingIsOK(false);
    setEmailCodeIsValid(false);
    setCodeAlertMessage("");
  }, [inputEmail]);

  // 가입완료
  const signup = async () => {
    const signupData = {
      userLoginId: inputId,
      password: inputPassword,
      confirmPassword: inputConfirmPassword,
      nickname: inputNickname,
      email: inputEmail,
    };
    try {
      await authApi.post("/signup", signupData);
      // 성공하면 이어서 진행
      Swal.fire({
        title: "회원가입 완료",
        customClass: {
          popup: "custom-swal-popup",
        },
        html: "회원가입이 완료되었습니다.<br>로그인을 진행해주세요.",
        icon: "success",
        confirmButtonColor: "#03C777",
        didClose: () => navigate(-1),
      });
    } catch (error) {
      Swal.fire({
        title: "회원가입 실패",
        customClass: {
          popup: "custom-swal-popup",
        },
        text: `${error.response.data.message}`,
        icon: "error",
        confirmButtonColor: "#03C777",
        confirmButtonText: "확인",
      });
    }
  };

  // 뒤로가기
  const goBack = () => {
    navigate(-1);
  };

  // 아이디 중복 확인 API 호출
  const isDuplicatedUserLoginId = async () => {
    const userLoginId = inputId;
    try {
      const isDuplicatedUserLoginIdResponse = await authApi.get(
        "/user-login-id",
        {
          params: {
            userLoginId,
          },
        }
      );
      // 성공하면 이어서 진행
      const isDuplicated =
        isDuplicatedUserLoginIdResponse.data.data.isDuplicated;
      if (isDuplicated) {
        setIdDuplicationIsOK(false);
        setIdAlertMessageColor(false);
        setIdAlertMessage("이미 존재하는 아이디입니다.");
        Swal.fire({
          title: "아이디 중복",
          text: "이미 존재하는 아이디입니다.",
          customClass: {
            popup: "custom-swal-popup",
          },
          icon: "error",
          confirmButtonColor: "#03C777",
          confirmButtonText: "확인",
        });
      } else {
        setIdDuplicationIsOK(true);
        setIdAlertMessageColor(true);
        setIdAlertMessage("사용 가능한 아이디입니다.");
        Swal.fire({
          title: "아이디 확인",
          text: "사용 가능한 아이디입니다.",
          customClass: {
            popup: "custom-swal-popup",
          },
          icon: "success",
          confirmButtonColor: "#03C777",
          confirmButtonText: "확인",
        });
      }
    } catch (error) {
      // 에러가 발생하면 여기로 진입
      Swal.fire({
        title: "아이디 조회 오류",
        customClass: {
          popup: "custom-swal-popup",
        },
        text: `${error.response.data.message}`,
        icon: "error",
        confirmButtonColor: "#03C777",
        confirmButtonText: "확인",
      });
    }
  };

  // 이메일 중복 확인 API 호출
  const isDuplicatedEmail = async () => {
    setEmailSendingIsOK(false);
    setEmailCodeIsValid(false);
    setCodeAlertMessage("");
    const email = inputEmail;
    try {
      const isDuplicatedEmailResponse = await authApi.get("/email", {
        params: {
          email,
        },
      });
      // 성공하면 이어서 진행
      const isDuplicated = isDuplicatedEmailResponse.data.data.isDuplicated;
      if (isDuplicated) {
        setEmailDuplicationIsOK(false);
        setEmailAlertMessageColor(false);
        setEmailAlertMessage("이미 존재하는 이메일입니다.");
        Swal.fire({
          title: "이메일 중복",
          text: "이미 사용 중인 이메일입니다.",
          customClass: {
            popup: "custom-swal-popup",
          },
          icon: "error",
          confirmButtonColor: "#03C777",
          confirmButtonText: "확인",
        });
      } else {
        setEmailDuplicationIsOK(true);
        setEmailAlertMessageColor(true);
        setEmailAlertMessage(
          "사용 가능한 이메일입니다. 이메일 인증을 진행해주세요."
        );
        Swal.fire({
          title: "이메일 확인",
          customClass: {
            popup: "custom-swal-popup",
          },
          html: "사용 가능한 이메일입니다.<br>이메일 인증을 진행해주세요.",
          icon: "success",
          confirmButtonColor: "#03C777",
          confirmButtonText: "확인",
        });
      }
    } catch (error) {
      // 에러가 발생하면 여기로 진입
      Swal.fire({
        title: "이메일 조회 오류",
        customClass: {
          popup: "custom-swal-popup",
        },
        text: `${error.response.data.message}`,
        icon: "error",
        confirmButtonColor: "#03C777",
        confirmButtonText: "확인",
      });
    }
  };

  // 인증 코드 전송 API 호출
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
      Swal.fire({
        title: "인증 코드 발송",
        text: "인증 코드가 발송되었습니다.",
        customClass: {
          popup: "custom-swal-popup",
        },
        icon: "success",
        confirmButtonColor: "#03C777",
        confirmButtonText: "확인",
      });
    } catch (error) {
      // 에러가 발생하면 여기로 진입
      setEmailSendingIsOK(false);
      Swal.fire({
        title: "인증 코드 발송 오류",
        customClass: {
          popup: "custom-swal-popup",
        },
        text: `${error.response.data.message}`,
        icon: "error",
        confirmButtonColor: "#03C777",
        confirmButtonText: "확인",
      });
    }
  };

  // 인증 코드 확인 API 호출
  const checkCode = async () => {
    const checkCodeData = {
      email: inputEmail,
      code: inputCode,
    };
    try {
      await authApi.post("/code/check", checkCodeData);
      // 성공하면 이어서 진행
      setEmailCodeIsValid(true);
      setCodeAlertMessage("이메일 인증에 성공하였습니다.");
      Swal.fire({
        title: "이메일 인증 성공",
        text: "이메일 인증에 성공하였습니다.",
        customClass: {
          popup: "custom-swal-popup",
        },
        icon: "success",
        confirmButtonColor: "#03C777",
        confirmButtonText: "확인",
      });
    } catch (error) {
      setEmailCodeIsValid(false);
      setCodeAlertMessage(error.response.data.message);
      Swal.fire({
        title: "이메일 인증 오류",
        customClass: {
          popup: "custom-swal-popup",
        },
        text: `${error.response.data.message}`,
        icon: "error",
        confirmButtonColor: "#03C777",
        confirmButtonText: "확인",
      });
    }
  };

  return (
    <div className="h-[100vh] flex justify-center items-center">
      <div className="w-[60vw] h-[70vh] flex flex-col justify-between items-center bg-[#333333] bg-opacity-90 p-5 rounded-lg text-white">
        <h1 className="text-[30px] font-bold">회원가입</h1>
        <div
          id="main-content"
          className="flex flex-col h-[70%] w-full items-center"
        >
          <div className="flex justify-between w-[90%]">
            <div className="flex w-[50%]">
              <div className="relative z-0 mb-5 group text-start w-[65%]">
                <input
                  type="text"
                  name="idInput"
                  id="idInput"
                  value={inputId}
                  onChange={(e) => setInputId(e.target.value)}
                  className="w-[85%] block py-2.5 px-0 text-md text-bold text-white bg-transparent border-0 border-b-2 border-[#5c5c5c] appearance-none focus:outline-none focus:ring-0 focus:border-[#66AADF] peer"
                  placeholder=" "
                  required
                />
                <label
                  htmlFor="idInput"
                  className="peer-focus:font-bold absolute text-md text-bold text-white duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-[#66aadf] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  ID
                </label>
                {/* 경고메시지 */}
                <div
                  className={`absolute top-[115%] font-bold text-${
                    idAlertMessageColor ? "[#03c777]" : "[#f40000]"
                  }`}
                >
                  {idAlertMessage}
                </div>
              </div>
              <button
                className="bg-[#66aadf] rounded-xl px-5 py-2 hover:bg-[#4d90d8] focus:ring-4 focus:ring-[#66aadf] mb-5 ms-0"
                disabled={!idFormatIsOK}
                onClick={isDuplicatedUserLoginId}
              >
                중복 확인
              </button>
            </div>
            <div className="relative z-0 mb-5 group text-start w-[45%]">
              <input
                type="text"
                name="inputNickname"
                id="inputNickname"
                value={inputNickname}
                onChange={(e) => setInputNickname(e.target.value)}
                className="w-[70%] block py-2.5 px-0 text-md text-bold text-white bg-transparent border-0 border-b-2 border-[#5c5c5c] appearance-none focus:outline-none focus:ring-0 focus:border-[#66AADF] peer"
                placeholder=" "
                required
              />
              <label
                htmlFor="idInput"
                className="peer-focus:font-bold absolute text-md text-bold text-white duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-[#66aadf] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                닉네임
              </label>
              {/* 경고메시지 */}
              <div
                className={`absolute top-[115%] font-bold text-${
                  nicknameFormatIsOK ? "[#03c777]" : "[#f40000]"
                }`}
              >
                {nicknameAlertMessage}
              </div>
            </div>
          </div>
          <div className="flex justify-between w-[90%] h-[45%] mt-[7%]">
            <div className="flex flex-col items-start justify-between w-[30%]">
              <div className="relative z-0 w-full group text-start">
                <input
                  type="password"
                  name="inputPassword"
                  id="inputPassword"
                  value={inputPassword}
                  onChange={(e) => setInputPassword(e.target.value)}
                  className="w-[92%] block py-2.5 px-0 text-md text-bold text-white bg-transparent border-0 border-b-2 border-[#5c5c5c] appearance-none focus:outline-none focus:ring-0 focus:border-[#66AADF] peer"
                  placeholder=" "
                  required
                />
                <label
                  htmlFor="idInput"
                  className="peer-focus:font-bold absolute text-md text-bold text-white duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-[#66aadf] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  비밀번호
                </label>
                {/* 경고메시지 */}
                <div
                  className={`absolute top-[115%] font-bold text-${
                    passwordFormatIsOK ? "[#03c777]" : "[#f40000]"
                  }`}
                >
                  {passwordAlertMessage}
                </div>
              </div>
              <div className="relative z-0 w-full group text-start">
                <input
                  type="password"
                  name="inputConfirmPassword"
                  id="inputConfirmPassword"
                  value={inputConfirmPassword}
                  onChange={(e) => setInputConfirmPassword(e.target.value)}
                  className="w-[92%] block py-2.5 px-0 text-md text-bold text-white bg-transparent border-0 border-b-2 border-[#5c5c5c] appearance-none focus:outline-none focus:ring-0 focus:border-[#66AADF] peer"
                  placeholder=" "
                  required
                />
                <label
                  htmlFor="idInput"
                  className="peer-focus:font-bold absolute text-md text-bold text-white duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-[#66aadf] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  비밀번호확인
                </label>
                {/* 경고메시지 */}
                <div
                  className={`absolute top-[115%] font-bold text-${
                    confirmPasswordFormatIsOK ? "[#03c777]" : "[#f40000]"
                  }`}
                >
                  {confirmPasswordAlertMessage}
                </div>
              </div>
            </div>
            <div className="flex flex-col items-start justify-between w-[60%]">
              <div className="flex justify-between w-full">
                <div className="relative z-0 w-[58%] group text-start">
                  <input
                    type="text"
                    name="inputEmail"
                    id="inputEmail"
                    value={inputEmail}
                    onChange={(e) => setInputEmail(e.target.value)}
                    className="w-[90%] block py-2.5 px-0 text-md text-bold text-white bg-transparent border-0 border-b-2 border-[#5c5c5c] appearance-none focus:outline-none focus:ring-0 focus:border-[#66AADF] peer"
                    placeholder=" "
                    required
                  />
                  <label
                    htmlFor="idInput"
                    className="peer-focus:font-bold absolute text-md text-bold text-white duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-[#66aadf] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    이메일
                  </label>
                  {/* 경고메시지 */}
                  <div
                    className={`absolute top-[115%] font-bold text-${
                      emailAlertMessageColor ? "[#03c777]" : "[#f40000]"
                    }`}
                  >
                    {emailAlertMessage}
                  </div>
                </div>
                <button
                  className="bg-[#66aadf] rounded-xl px-5 py-2 hover:bg-[#4d90d8] focus:ring-4 focus:ring-[#66aadf] my-2 ms-0 me-3"
                  disabled={!emailFormatIsOK}
                  onClick={isDuplicatedEmail}
                >
                  중복 확인
                </button>
                <button
                  className="bg-[#66aadf] rounded-xl px-5 py-2 hover:bg-[#4d90d8] focus:ring-4 focus:ring-[#66aadf] my-2 ms-0"
                  disabled={!emailFormatIsOK || !emailDuplicationIsOK}
                  onClick={sendCode}
                >
                  인증코드 전송
                </button>
              </div>
              <div className="flex justify-between">
                <div className="relative z-0 w-[58%] group text-start">
                  <input
                    type="text"
                    name="inputCode"
                    id="inputCode"
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value)}
                    className="w-[90%] block py-2.5 px-0 text-md text-bold text-white bg-transparent border-0 border-b-2 border-[#5c5c5c] appearance-none focus:outline-none focus:ring-0 focus:border-[#66AADF] peer"
                    placeholder=" "
                    required
                  />
                  <label
                    htmlFor="idInput"
                    className="peer-focus:font-bold absolute text-md text-bold text-white duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-[#66aadf] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    인증코드 확인
                  </label>
                  {/* 경고메시지 */}
                  <div
                    className={`absolute top-[115%] font-bold text-${
                      emailCodeIsValid ? "[#03c777]" : "[#f40000]"
                    }`}
                  >
                    {codeAlertMessage}
                  </div>
                </div>
                <button
                  className="bg-[#66aadf] rounded-xl px-5 py-2 hover:bg-[#4d90d8] focus:ring-4 focus:ring-[#66aadf]"
                  disabled={
                    !emailFormatIsOK ||
                    !emailDuplicationIsOK ||
                    !emailSendingIsOK
                  }
                  onClick={checkCode}
                >
                  확인
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-content flex justify-around w-[30%]">
          <button
            disabled={
              !idFormatIsOK ||
              !idDuplicationIsOK ||
              !nicknameFormatIsOK ||
              !passwordFormatIsOK ||
              !confirmPasswordFormatIsOK ||
              !emailFormatIsOK ||
              !emailDuplicationIsOK ||
              !emailSendingIsOK ||
              !emailCodeIsValid
            }
            onClick={signup}
            className="bg-[#03c777] rounded-xl px-5 py-2 hover:bg-[#02a566] focus:ring-4 focus:ring-[#03c777] font-bold"
          >
            가입 완료
          </button>
          <button
            onClick={goBack}
            className="bg-[#7c7c7c] rounded-xl px-5 py-2 hover:bg-[#5c5c5c] focus:ring-4 focus:ring-[#c5c5c5] text-white font-bold"
          >
            돌아가기
          </button>
        </div>
      </div>
    </div>
  );
}

export default SignupPage;

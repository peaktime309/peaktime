import { useState } from "react";
import { useNavigate } from "react-router-dom";
import authApi from "../api/authApi";
import Swal from "sweetalert2"; // 모달 라이브러리
import "../styles/daily-report-custom-swal.css";

function PasswordReissuePage() {
  // 라우팅 설정
  const navigate = useNavigate();

  // 입력 변수 (for 양방향 바인딩)
  const [inputId, setInputId] = useState("");
  const [inputEmail, setInputEmail] = useState("");

  // 뒤로가기
  const goBack = () => {
    navigate(-1);
  };

  // 비밀번호 재발급 API 요청
  const resetPassword = async () => {
    const resetPasswordData = {
      userLoginId: inputId,
      email: inputEmail,
    };
    try {
      await authApi.put("/reset-password", resetPasswordData);
      // 성공하면 이어서 진행
      Swal.fire({
        title: "임시 비밀번호 발급 성공",
        customClass: {
          popup: "custom-swal-popup",
        },
        html: "임시 비밀번호가 발급되었습니다.<br>로그인을 진행해주세요.",
        icon: "success",
        confirmButtonColor: "#03C777",
        didClose: () => navigate("/login"),
      });
    } catch (error) {
      Swal.fire({
        title: "임시 비밀번호 발급 실패",
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
        <h1 className="text-[30px] font-bold">비밀번호 재발급</h1>
        <div
          id="main-content"
          className="flex flex-col h-[70%] w-full items-center justify-evenly"
        >
          <div className="w-[50%] flex">
            <div className="flex flex-col w-[70%] gap-y-5">
              <div className="relative z-0 mb-5 group text-start w-full">
                <input
                  type="text"
                  name="inputId"
                  id="inputId"
                  value={inputId}
                  onChange={(e) => setInputId(e.target.value)}
                  className="w-[70%] block py-2.5 px-0 text-md text-bold text-white bg-transparent border-0 border-b-2 border-[#5c5c5c] appearance-none focus:outline-none focus:ring-0 focus:border-[#66AADF] peer"
                  placeholder=" "
                  required
                />
                <label
                  htmlFor="idInput"
                  className="peer-focus:font-bold absolute text-md text-bold text-white duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-[#66aadf] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  ID
                </label>
              </div>
              <div className="flex">
                <div className="relative z-0 mb-5 group text-start w-full">
                  <input
                    type="text"
                    name="inputEmail"
                    id="inputEmail"
                    value={inputEmail}
                    onChange={(e) => setInputEmail(e.target.value)}
                    className="w-[70%] block py-2.5 px-0 text-md text-bold text-white bg-transparent border-0 border-b-2 border-[#5c5c5c] appearance-none focus:outline-none focus:ring-0 focus:border-[#66AADF] peer"
                    placeholder=" "
                    required
                  />
                  <label
                    htmlFor="idInput"
                    className="peer-focus:font-bold absolute text-md text-bold text-white duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-[#66aadf] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    이메일
                  </label>
                </div>
              </div>
            </div>

            <div className="flex w-[30%] h-full justify-center items-center">
              <button
                className="bg-[#66aadf] rounded-xl px-5 py-2 hover:bg-[#4d90d8] focus:ring-4 focus:ring-[#66aadf] font-bold whitespace-nowrap"
                style={{
                  height: "40px",
                  lineHeight: "normal",
                }}
                onClick={resetPassword}
              >
                비밀번호 발급
              </button>
            </div>
          </div>

          <div className="text-[18px] text-[#F40000]">
            * 서브 유저는 비밀번호 재발급이 불가능합니다.
          </div>
        </div>

        <button
          className="bg-[#7c7c7c] rounded-xl px-5 py-2 hover:bg-[#5c5c5c] focus:ring-4 focus:ring-[#c5c5c5] text-white font-bold"
          onClick={goBack}
        >
          돌아가기
        </button>
      </div>
    </div>
  );
}

export default PasswordReissuePage;

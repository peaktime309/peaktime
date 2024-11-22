import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // 모달 라이브러리
import "../styles/daily-report-custom-swal.css";
import { useState } from "react";
import usersApi from "../api/usersApi";

function PasswordChangePage() {
  // 라우팅 설정
  const navigate = useNavigate();

  // 입력 변수 (for 양방향 바인딩)
  const [inputNewPassword, setInputNewPassword] = useState("");
  const [inputConfirmNewPassword, setInputConfirmNewPassword] = useState("");

  // 비밀번호 변경 API 호출
  const updatePassword = async () => {
    const updatePasswordData = {
      newPassword: inputNewPassword,
      confirmNewPassword: inputConfirmNewPassword,
    };
    try {
      await usersApi.put("/password", updatePasswordData);
      // 성공하면 이어서 진행
      Swal.fire({
        title: "비밀번호 변경 성공",
        customClass: {
          popup: "custom-swal-popup",
        },
        html: "비밀번호가 성공적으로 변경되었습니다.<br>메인 페이지로 되돌아갑니다.",
        icon: "success",
        confirmButtonColor: "#03C777",
        didClose: () => navigate("/"),
      });
    } catch (error) {
      // 실패하면 여기로 진입
      if (error.response.data.status === 400) {
        // 형식 요청을 생으로 커스터마이징하자 !! 나머지는 그냥 백에서 응답온 그대로 보여주자..
        Swal.fire({
          title: "비밃번호 변경 오류",
          customClass: {
            popup: "custom-swal-popup",
          },
          text: "비밀번호의 형식이 유효하지 않거나 새 비밀번호와 확인 비밀번호가 일치하지 않습니다.",
          icon: "error",
          confirmButtonColor: "#03C777",
          confirmButtonText: "확인",
        });
      } else {
        Swal.fire({
          title: "비밀번호 변경 오류",
          customClass: {
            popup: "custom-swal-popup",
          },
          text: `${error.response.data.message}`,
          icon: "error",
          confirmButtonColor: "#03C777",
          confirmButtonText: "확인",
        });
      }
    }
  };

  // 뒤로가기
  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="h-[100vh] flex justify-center items-center">
      <div className="w-[60vw] h-[70vh] flex flex-col justify-between items-center bg-[#333333] bg-opacity-90 p-5 rounded-lg text-white">
        <h1 className="text-[30px] font-bold">비밀번호 변경</h1>
        <div className="flex flex-col gap-3 justify-between w-[70%]">
          <div className="flex flex-col gap-3 text-start w-[40%]">
            <label htmlFor="" className="text-white font-bold text-[22px]">
              새 비밀번호
            </label>
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              value={inputNewPassword}
              onChange={(e) => {
                setInputNewPassword(e.target.value);
              }}
              className="px-3 py-3 h-[60%] rounded-lg ps-3 bg-opacity-90 text-black font-bold"
            />
            <div className="text-[#F40000]">
              * 최소 8자 이상, 영문 대문자, 영문 소문자, 숫자, 특수문자를 모두
              포함
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3 justify-between w-[70%]">
          <div className="flex gap-3 text-start w-full relative">
            <div className="flex flex-col gap-3 w-[40%]">
              <label
                htmlFor="nickname"
                className="text-white font-bold text-[22px]"
              >
                새 비밀번호 확인
              </label>
              <input
                id="confirmNewPassword"
                name="confirmNewPassword"
                type="password"
                value={inputConfirmNewPassword}
                onChange={(e) => {
                  setInputConfirmNewPassword(e.target.value);
                }}
                className="px-3 py-3 h-[100%] rounded-lg ps-3 bg-opacity-90 text-black font-bold"
              />
              <div className="text-[#F40000]">* 비밀번호를 재입력해주세요</div>
            </div>
          </div>
        </div>

        <div className="flex gap-x-5 mb-5">
          <button
            className="bg-[#03c777] rounded-xl px-5 py-2 hover:bg-[#02a566] focus:ring-4 focus:ring-[#03c777] text-white font-bold "
            onClick={updatePassword}
          >
            변경하기
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

export default PasswordChangePage;

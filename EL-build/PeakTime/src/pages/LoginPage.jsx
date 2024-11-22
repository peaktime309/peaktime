import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../stores/UserStore";
import authApi from "../api/authApi";
import Swal from "sweetalert2";
import "../styles/daily-report-custom-swal.css";

function LoginPage() {
  // 스토어 불러오기
  const { user, userActions } = useUserStore();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // 로그인 버튼 클릭
  const handleLogin = async () => {
    console.log("로그인 시작");

    if (username && password) {
      const loginData = {
        userLoginId: username,
        password: password,
      };
      try {
        const loginResponse = await authApi.post("/login", loginData, {
          withCredentials: true,
        });
        // 성공하면 이어서 진행
        userActions.setUser(loginResponse.data.data);
        localStorage.setItem("user", JSON.stringify(loginResponse.data.data));
        navigate("/");
      } catch (error) {
        // 에러 코드가 발생하면 여기로 진입
        Swal.fire({
          title: "로그인 오류",
          customClass: {
            popup: "custom-swal-popup",
          },
          text: `${error.response.data.message}`,
          icon: "error",
          confirmButtonColor: "#03C777",
          confirmButtonText: "확인",
        });
      }
    } else {
      Swal.fire({
        title: "입력 오류",
        customClass: {
          popup: "custom-swal-popup",
        },
        text: "아이디와 비밀번호를 입력해 주세요.",
        icon: "error",
        confirmButtonColor: "#03C777",
        confirmButtonText: "확인",
      });
    }
  };

  // 회원 가입 버튼 클릭
  const handleSignup = () => {
    navigate("/signup");
  };

  // 비밀번호 재발급 버튼 클릭
  const handlePasswordReissue = () => {
    navigate("/passwordreissue");
  };

  return (
    <div className="h-[100vh] flex justify-center items-center">
      <div className="w-[30vw] h-[60vh] flex flex-col justify-around items-center bg-[#333333] bg-opacity-90 p-5 rounded-lg text-white">
        <h1 className="text-[30px] font-bold">로그인</h1>
        <div className="relative z-0 w-full mb-5 group text-start ms-[30%]">
          <input
            type="text"
            name="idInput"
            id="idInput"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
        <div className="relative z-0 w-full mb-5 group text-start ms-[30%]">
          <input
            type="password"
            name="passwordInput"
            id="passwordInput"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-[70%] block py-2.5 px-0 text-md text-bold text-white bg-transparent border-0 border-b-2 border-[#5c5c5c] appearance-none focus:outline-none focus:ring-0 focus:border-[#66AADF] peer"
            placeholder=" "
            required
          />
          <label
            htmlFor="passwordInput"
            className="peer-focus:font-bold absolute text-md text-bold text-white duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-[#66aadf] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            비밀번호
          </label>
        </div>

        <button
          onClick={handleLogin}
          className="bg-[#03c777] rounded-xl px-5 py-2 hover:bg-[#02a566] focus:ring-4 focus:ring-[#03c777]"
        >
          로그인
        </button>
        <div className="flex w-full justify-around">
          <button
            onClick={handleSignup}
            className="bg-[#66aadf] rounded-xl px-5 py-2 hover:bg-[#4d90d8] focus:ring-4 focus:ring-[#66aadf]"
          >
            회원 가입
          </button>
          <button
            onClick={handlePasswordReissue}
            className="bg-[#4d90d8] rounded-xl px-5 py-2 hover:bg-[#3476d0] focus:ring-4 focus:ring-[#4d90d8]"
          >
            비밀번호 재발급
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;

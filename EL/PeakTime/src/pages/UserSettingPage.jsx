import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // 모달 라이브러리
import { useEffect, useState } from "react";
import usersApi from "../api/usersApi";
import "../styles/daily-report-custom-swal.css";

function UserSettingPage() {
  // 라우팅 설정
  const navigate = useNavigate();

  // 입력 변수 (for 양방향 바인딩)
  const [inputId, setInputId] = useState("");
  const [inputNickname, setInputNickname] = useState("");

  // 닉네임 placeholder
  const [nicknamePlaceholder, setNicknamePlaceholder] = useState("");

  // 호출 trigger
  const [trigger, setTrigger] = useState(false);

  // useEffect 모음
  useEffect(() => {
    getProfile();
  }, [trigger]);

  // 프로필 조회 API 호출
  const getProfile = async () => {
    try {
      const getProfileResponse = await usersApi.get("");
      // 성공하면 이어서 진행
      setInputId(getProfileResponse.data.data.userLoginId);
      setNicknamePlaceholder(getProfileResponse.data.data.nickname);
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

  // 닉네임 변경 API 호출
  const updateNickname = async () => {
    const updateNicknameData = {
      nickname: inputNickname,
    }
    try {
      await usersApi.put("/nickname", updateNicknameData);
      // 성공하면 이어서 진행
      Swal.fire({
        title: "닉네임이 변경되었습니다.",
        customClass: {
          popup: 'custom-swal-popup',
        },
        icon: "success",
        confirmButtonColor: "#03C777",
        confirmButtonText: "확인",
      });
      setTrigger(!trigger);
    } catch (error) {
      // 에러가 발생하면 여기로 진입
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

  // 변경 페이지 이동
  const handleChangeBtn = (type) => {
    navigate(type);
  };

  // 뒤로가기
  const goBack = () => {
    navigate(-1);
  };

  // 회원탈퇴 모달
  const openDeleteModal = () => {
    Swal.fire({
      title: "정말로 회원탈퇴 하시겠습니까?",
      customClass: {
        popup: 'custom-swal-popup',
      },
      icon: "warning",
      confirmButtonColor: "#F40000",
      confirmButtonText: "탈퇴",
      showDenyButton: true,
      denyButtonText: `취소`,
      denyButtonColor: `#5C5C5C`,
    }).then(result => {
      if (result.isConfirmed) {
        // 삭제 버튼을 눌렀다면
        Swal.fire({
          title: "회원탈퇴가 완료되었습니다.",
          customClass: {
            popup: 'custom-swal-popup',
          },
          icon: "success",
          confirmButtonColor: "#03C777",
          confirmButtonText: "확인",
        }).then(result => {
          if (result.isConfirmed) {
            deleteUser();
          }
        });
      }
    });
  };

  // 회원탈퇴 API 호출
  const deleteUser = async () => {
    try {
      await usersApi.delete("");
      // 성공하면 이어서 진행
      localStorage.removeItem("user"); // LocalStorage에 존재하는 Access Token 삭제
      window.location.href = "/login"; // 로그인 페이지로 강제 라우팅
    } catch (error) {
      // 에러가 발생하면 여기로 진입
      Swal.fire({
        title: "회원탈퇴에 실패하였습니다.",
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

  return (
    <div className="h-[100vh] flex justify-center items-center">
      <div className="w-[60vw] h-[70vh] flex flex-col justify-between items-center bg-[#333333] bg-opacity-90 p-5 rounded-lg text-white">
        <h1 className="text-[30px] font-bold">개인 설정</h1>
        <div className="flex flex-col gap-3 justify-between w-[70%]">
          <div className="flex flex-col gap-3 text-start w-[40%]">
            <label htmlFor="" className="text-white font-bold">
              아이디
            </label>
            <input
              id="userLoginId"
              name="userLoginId"
              value={inputId}
              disabled
              className="px-3 py-3 h-[60%] rounded-lg ps-3 bg-opacity-90 text-white font-bold"
            />
          </div>
        </div>
        <div className="flex flex-col gap-3 justify-between w-[70%]">
          <div className="flex gap-3 text-start w-full relative">
            <div className="flex flex-col gap-3 w-[40%]">
              <label htmlFor="nickname" className="text-white font-bold">
                닉네임 변경 (2자 이상 15자 이하의 한글, 영문, 숫자 사용 가능)
              </label>
              <input
                id="nickname"
                name="nickname"
                type="text"
                value={inputNickname}
                placeholder={nicknamePlaceholder}
                onChange={(e) => { setInputNickname(e.target.value); }}
                className="px-3 py-3 h-[100%] rounded-lg ps-3 bg-opacity-90 text-black font-bold"
              />
            </div>
            <button
              className="absolute left-[45%] bottom-0 bg-[#03c777] rounded-xl px-5 py-3 hover:bg-[#02a566] focus:ring-4 focus:ring-[#03c777] text-white font-bold "
              onClick={updateNickname}
            >
              변경하기
            </button>
          </div>
        </div>
        <div id="changePageButton" className="flex gap-5 w-[70%]">
          <button
            onClick={() => handleChangeBtn("/emailchange")}
            className="bg-[#66aadf] rounded-xl px-5 py-2 hover:bg-[#4d90d8] focus:ring-4 focus:ring-[#66aadf] font-bold text-white">
            이메일 변경
          </button>
        </div>
        <div id="footerButton" className="flex gap-5">
          <button
            onClick={goBack}
            className="bg-[#7c7c7c] rounded-xl px-5 py-2 hover:bg-[#5c5c5c] focus:ring-4 focus:ring-[#c5c5c5] text-white font-bold">
            돌아가기
          </button>
          <button
            onClick={openDeleteModal}
            className="bg-[#f40000] rounded-xl px-5 py-2 hover:bg-[#d60000] focus:ring-4 focus:ring-[#f40000] text-white font-bold">
            회원탈퇴
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserSettingPage;

import "../../styles/daily-report-custom-swal.css"

const successToUpdate = {
  title: "계정 상태 수정 성공",
  text: "계정 상태를 성공적으로 변경했습니다.",
  icon: "success",
  confirmButtonText: "확인",
  confirmButtonColor: "#03C777",
  customClass: {
    popup: "custom-swal-popup",
  }
};

// 404
const groupNotFound = {
  title: "그룹 없음",
  text: "해당 그룹을 찾을 수 없습니다.",
  icon: "error",
  confirmButtonText: "확인",
  confirmButtonColor: "#03C777",
  customClass: {
    popup: "custom-swal-popup",
  }
};

// 422
const limitExceeded = {
  title: "그룹 인원 초과",
  text: "그룹 인원은 최대 30명으로 제한됩니다.",
  icon: "error",
  confirmButtonText: "확인",
  confirmButtonColor: "#03C777",
  customClass: {
    popup: "custom-swal-popup",
  }
};

// 404
const invalidNicknameFormat = {
  title: "닉네임 형식 오류",
  text: "닉네임 형식이 올바르지 않습니다.",
  icon: "error",
  confirmButtonText: "확인",
  confirmButtonColor: "#03C777",
  customClass: {
    popup: "custom-swal-popup",
  }
};

// 404
const userNotFound = {
  title: "유저 조회 실패",
  text: "존재하지 않는 유저입니다.",
  icon: "error",
  confirmButtonText: "확인",
  confirmButtonColor: "#03C777",
  customClass: {
    popup: "custom-swal-popup",
  }
};

const defaultMessage = {
  title: "유저 정보 수정 실패",
  text: "유저 정보 수정에 실패했습니다. 잠시 후 다시 시도해주세요.",
  icon: "error",
  confirmButtonText: "확인",
  confirmButtonColor: "#03C777",
  customClass: {
    popup: "custom-swal-popup",
  }
};

const handle404Message = (message) => {
  switch (message) {
    case "닉네임 형식이 올바르지 않습니다.":
      return invalidNicknameFormat;
    case "존재하지 않는 그룹입니다.":
      return groupNotFound;
    case "존재하지 않은 유저입니다.":
      return userNotFound;
    default:
      return defaultMessage;
  }
};

export const updateChildAlertMessage = (error = null) => {
  if (!error) {
    return successToUpdate;
  } else {
    switch (error.status) {
      case 404:
        return handle404Message(error.message);
      case 422:
        return limitExceeded;
      default:
        return defaultMessage;
    }
  }
};

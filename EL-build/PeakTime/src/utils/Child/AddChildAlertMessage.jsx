import "../../styles/daily-report-custom-swal.css";

const emptyFieldWarning = {
  title: "입력 정보 누락",
  text: "입력하신 정보를 다시 한 번 확인해 주세요.",
  icon: "warning",
  confirmButtonText: "확인",
  confirmButtonColor: "#03C777",
  customClass: {
    popup: "custom-swal-popup",
  }
};

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

const invalidIdFormat = {
  title: "아이디 형식 오류",
  text: "아이디 형식이 올바르지 않습니다.",
  icon: "error",
  confirmButtonText: "확인",
  confirmButtonColor: "#03C777",
  customClass: {
    popup: "custom-swal-popup",
  }
};

const duplicateId = {
  title: "유저 생성 실패",
  text: "중복된 ID가 있습니다.",
  icon: "error",
  confirmButtonText: "확인",
  confirmButtonColor: "#03C777",
  customClass: {
    popup: "custom-swal-popup",
  }
};

const invalidPasswordFormat = {
  title: "비밀번호 형식 오류",
  text: "비밀번호 형식이 올바르지 않습니다.",
  icon: "error",
  confirmButtonText: "확인",
  confirmButtonColor: "#03C777",
  customClass: {
    popup: "custom-swal-popup",
  }
};

const passwordMismatch = {
  title: "비밀번호 불일치",
  text: "비밀번호와 비밀번호 확인이 일치하지 않습니다.",
  icon: "error",
  confirmButtonText: "확인",
  confirmButtonColor: "#03C777",
  customClass: {
    popup: "custom-swal-popup",
  }
};

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

const successToCreateUser = {
  title: "유저 생성 성공",
  text: "유저 생성을 성공했습니다.",
  icon: "success",
  confirmButtonText: "확인",
  confirmButtonColor: "#03C777",
  customClass: {
    popup: "custom-swal-popup",
  }
};

const defaultMessage = {
  title: "유저 생성 실패",
  text: "유저 생성에 실패했습니다. 잠시 후 다시 시도해주세요.",
  icon: "error",
  confirmButtonText: "확인",
  confirmButtonColor: "#03C777",
  customClass: {
    popup: "custom-swal-popup",
  }
};

const handle404Message = (message) => {
  switch (message) {
    case "존재하지 않는 그룹입니다.":
      return groupNotFound;
    case "유저 로그인 아이디 형식이 올바르지 않습니다.":
      return invalidIdFormat;
    case "비밀번호 형식이 올바르지 않습니다.":
      return invalidPasswordFormat;
    case "비밀번호와 비밀번호 확인이 일치하지 않습니다.":
      return passwordMismatch;
    case "닉네임 형식이 올바르지 않습니다.":
      return invalidNicknameFormat;
    default:
      return defaultMessage;
  }
};

export const addChildAlertMessage = (error = null) => {
  if (!error) {
    return successToCreateUser;
  } else {
    switch (error.status) {
      case 409:
        return duplicateId;
      case 422:
        return limitExceeded;
      case 404:
        return handle404Message(error.message);
      case 400:
        return emptyFieldWarning;
      default:
        return defaultMessage;
    }
  }
};

export const errorToCheckIsIdDuplicated = {
  title: "중복 조회 중 오류 발생",
  text: "아이디 중복 조회 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
  icon: "error",
  confirmButtonText: "확인",
  confirmButtonColor: "#03C777",
  customClass: {
    popup: "custom-swal-popup",
  }
};

export const errorBeforeConfirm = {
  title: "입력 정보 확인",
  text: "입력하신 정보를 다시 한 번 확인해주세요.",
  icon: "error",
  confirmButtonText: "확인",
  confirmButtonColor: "#03C777",
  customClass: {
    popup: "custom-swal-popup",
  }
};

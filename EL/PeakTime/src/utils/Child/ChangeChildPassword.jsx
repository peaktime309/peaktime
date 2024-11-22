import "../../styles/daily-report-custom-swal.css";

const successToChange = {
  title: "비밀번호 수정 성공",
  text: "비밀번호를 성공적으로 수정했습니다.",
  icon: "success",
  confirmButtonText: "확인",
  confirmButtonColor: "#03C777",
  customClass: {
    popup: "custom-swal-popup",
  }
};

// 404
const invalidPassword = {
  title: "비밀번호 형식 오류",
  text: "비밀번호 형식이 올바르지 않습니다.",
  icon: "error",
  confirmButtonText: "확인",
  confirmButtonColor: "#03C777",
  customClass: {
    popup: "custom-swal-popup",
  }
};

// 404
const notEqualPassword = {
  title: "비밀번호 불일치",
  text: "입력한 비밀번호가 일치하지 않습니다.",
  icon: "error",
  confirmButtonText: "확인",
  confirmButtonColor: "#03C777",
  customClass: {
    popup: "custom-swal-popup",
  }
};

const defaultMessage = {
  title: "비밀번호 수정 실패",
  text: "비밀번호 수정을 실패했습니다. 잠시 후 다시 시도해주세요.",
  icon: "error",
  confirmButtonText: "확인",
  confirmButtonColor: "#03C777",
  customClass: {
    popup: "custom-swal-popup",
  }
};

const handle404Message = (message) => {
  switch (message) {
    case "비밀번호와 비밀번호 확인이 일치하지 않습니다.":
      return notEqualPassword;
    case "비밀번호 형식이 올바르지 않습니다.":
      return invalidPassword;
    default:
      return defaultMessage;
  }
};

export const changeChildPasswordMessage = (error = null) => {
  if (!error) {
    return successToChange;
  } else {
    switch (error.status) {
      case 404:
        return handle404Message(error.message);
      default:
        return defaultMessage;
    }
  }
};

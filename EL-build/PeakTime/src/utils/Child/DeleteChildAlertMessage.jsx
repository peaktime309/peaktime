import "../../styles/daily-report-custom-swal.css";

const checkToDelete = {
  title: "계정 삭제 확인",
  text: "선택한 계정을 삭제하시겠습니까?",
  icon: "warning",
  confirmButtonText: "예",
  confirmButtonColor: "#03C777",
  showDenyButton: true,
  denyButtonText: "아니오",
  denyButtonColor: "#C5C5C5",
  customClass: {
    popup: "custom-swal-popup",
  }
};

const successToDelete = {
  title: "계정 삭제 성공",
  text: "계정을 성공적으로 삭제했습니다.",
  icon: "success",
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
  title: "계정 삭제 실패",
  text: "계정 삭제를 실패했습니다. 잠시 후 다시 시도해주세요.",
  icon: "error",
  confirmButtonText: "확인",
  confirmButtonColor: "#03C777",
  customClass: {
    popup: "custom-swal-popup",
  }
};

const handle404Message = (message) => {
  switch (message) {
    case "존재하지 않은 유저입니다.":
      return userNotFound;
    default:
      return defaultMessage;
  }
};

export const deleteChildAlertMessage = (type, error = null) => {
  switch (type) {
    case "check":
      return checkToDelete;
    case "success":
      return successToDelete;
    case "fail":
      return handle404Message(error.message);
    default:
      return defaultMessage;
  }
};

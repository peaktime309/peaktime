import "../../styles/daily-report-custom-swal.css";

// 그룹명이나 프리셋을 지정하지 않았을 때
const warningForIncompleteInput = {
  title: "새 그룹 생성 경고",
  text: "입력 정보를 다시 한 번 확인해주세요.",
  icon: "warning",
  confirmButtonText: "확인",
  confirmButtonColor: "#03C777",
  customClass: {
    popup: "custom-swal-popup",
  }
};

// 그룹 생성 성공 시
const successToCreateGroup = {
  title: "새 그룹 생성 성공",
  text: "새 그룹이 생성되었습니다.",
  icon: "success",
  confirmButtonText: "확인",
  confirmButtonColor: "#03C777",
  customClass: {
    popup: "custom-swal-popup",
  }
};

// 그룹명 중복 시 409
const duplicateGroupTitleError = {
  title: "그룹명 중복 경고",
  text: "입력한 그룹 이름이 이미 존재합니다.",
  icon: "error",
  confirmButtonText: "확인",
  confirmButtonColor: "#03C777",
  customClass: {
    popup: "custom-swal-popup",
  }
};

// 그룹 생성 한도 초과 시 422
const groupCreationLimitExceeded = {
  title: "그룹 생성 한도 초과",
  text: "생성할 수 있는 그룹 수를 초과했습니다.",
  icon: "error",
  confirmButtonText: "확인",
  confirmButtonColor: "#03C777",
  customClass: {
    popup: "custom-swal-popup",
  }
};

// 그룹명 길이 초과 시
const groupTitleLength = {
  title: "그룹명 양식 에러",
  text: "그룹명은 1 ~ 32자까지 입력할 수 있습니다.",
  icon: "error",
  confirmButtonText: "확인",
  confirmButtonColor: "#03C777",
  customClass: {
    popup: "custom-swal-popup",
  }
};

// 기타 그룹 생성 실패 시
const failToCreateGroup = {
  title: "그룹 생성 실패",
  text: "그룹 생성을 실패했습니다. 잠시 후 다시 시도해주세요.",
  icon: "error",
  confirmButtonText: "확인",
  confirmButtonColor: "#03C777",
  customClass: {
    popup: "custom-swal-popup",
  }
};

export const addGroupAlertMessage = (type) => {
  if (type === "success") {
    return successToCreateGroup;
  } else {
    switch (type) {
      case "warning":
        return warningForIncompleteInput;
      case "length":
        return groupTitleLength;
      case "duplicate":
        return duplicateGroupTitleError;
      case "limit-exceed":
        return groupCreationLimitExceeded;
      default:
        return failToCreateGroup;
    }
  }
}
import "../../styles/daily-report-custom-swal.css";

const addCustomClass = (obj) => ({
  ...obj,
  customClass: {
    popup: "custom-swal-popup",
  },
});

export const UPDATE_GROUP_ALERT_MESSAGE = {
  // 그룹 조회 실패
  failToGetGroupInfo: addCustomClass({
    title: "그룹 정보 조회 실패",
    text: "그룹 정보 조회를 실패했습니다. 잠시 후 다시 시도해주세요.",
    icon: "error",
    confirmButtonText: "확인",
    confirmButtonColor: "#03C777",
  }),
  // 그룹 정보 업데이트 경고
  warningForUpdateGroupInfo: addCustomClass({
    title: "그룹 정보 변경",
    text: "그룹 정보를 수정하시겠습니까?",
    icon: "question",
    confirmButtonText: "확인",
    confirmButtonColor: "#03C777",
    showCancelButton: true,
    cancelButtonText: "취소",
    cancelButtonColor: "#F40000",
  }),
  // 그룹 수정 성공
  successToUpdateGroup: addCustomClass({
    title: "그룹 수정 성공",
    text: "그룹 정보 수정을 성공했습니다.",
    icon: "success",
    confirmButtonText: "확인",
    confirmButtonColor: "#03C777",
  }),
  // 그룹 수정 시 그룹명 중복
  duplicateGroupTitleError: addCustomClass({
    title: "그룹명 중복 경고",
    text: "입력한 그룹 이름이 이미 존재합니다.",
    icon: "error",
    confirmButtonText: "확인",
    confirmButtonColor: "#03C777",
  }),
  // 그룹명 길이 초과 시
  groupTitleLengthExceeded: addCustomClass({
    title: "그룹명 길이 초과",
    text: "그룹명은 최대 32자까지 입력할 수 있습니다.",
    icon: "error",
    confirmButtonText: "확인",
    confirmButtonColor: "#03C777",
  }),
  // 기타 그룹 수정 실패
  failToUpdateGroup: addCustomClass({
    title: "그룹 수정 실패",
    text: "그룹 정보 수정을 실패했습니다. 잠시 후 다시 시도해주세요.",
    icon: "error",
    confirmButtonText: "확인",
    confirmButtonColor: "#03C777",
  }),
  // 그룹 삭제 경고
  warningForDeleteGroup: addCustomClass({
    title: "그룹 삭제 경고",
    text: "그룹 삭제 시 하위 계정 정보도 모두 삭제됩니다. 정말 그룹을 삭제하시겠습니까?",
    icon: "warning",
    confirmButtonText: "확인",
    confirmButtonColor: "#03C777",
    showCancelButton: true,
    cancelButtonText: "취소",
    cancelButtonColor: "#F40000",
  }),
  // 그룹 삭제 성공
  succcessToDeleteGroup: addCustomClass({
    title: "그룹 삭제 성공",
    text: "그룹이 성공적으로 삭제되었습니다.",
    icon: "success",
    confirmButtonText: "확인",
    confirmButtonColor: "#03C777",
  }),
  // 그룹 삭제 실패
  failToDeleteGroup: addCustomClass({
    title: "그룹 삭제 실패",
    text: "그룹 삭제에 실패했습니다. 잠시 후 다시 시도해주세요.",
    icon: "error",
    confirmButtonText: "확인",
    confirmButtonColor: "#03C777",
  }),
  // 그룹 타이머 생성 성공
  successToCreateGroupTimer: addCustomClass({
    title: "타이머 생성 성공",
    text: "타이머를 성공적으로 생성했습니다.",
    icon: "success",
    confirmButtonText: "확인",
    confirmButtonColor: "#03C777",
  }),
  // 그룹 타이머 attention_time 조건 불만족
  attentionTimeOutOfRangeError: addCustomClass({
    title: "시간 설정 오류",
    text: "입력한 시간이 30분에서 240분 사이여야 합니다.",
    icon: "warning",
    confirmButtonText: "확인",
    confirmButtonColor: "#03C777",
  }),
  // 그룹 타이머 요일 선택 조건 불만족
  notSelectedRepeatDayError: addCustomClass({
    title: "요일 선택 오류",
    text: "요일을 하나 이상 선택해야 합니다.",
    icon: "warning",
    confirmButtonText: "확인",
    confirmButtonColor: "#03C777",
  }),
  // 그룹 타이머 중복 오류
  duplicateGroupTimerError: addCustomClass({
    title: "타이머 중복",
    text: "선택한 시간 범위가 다른 예약과 겹칩니다.",
    icon: "error",
    confirmButtonText: "확인",
    confirmButtonColor: "#03C777",
  }),
  // 그룹 타이머 생성 오류
  failToCreateGroupTime: addCustomClass({
    title: "타이머 생성 실패",
    text: "타이머 생성에 실패했습니다. 잠시 후 다시 시도해주세요.",
    icon: "error",
    confirmButtonText: "확인",
    confirmButtonColor: "#03C777",
  }),
  // 그룹 타이머 삭제 경고
  warningForDeleteTimer: addCustomClass({
    title: "타이머 삭제 경고",
    text: "타이머는 삭제 즉시 변경 사항이 반영됩니다. 정말 타이머를 삭제하시겠습니까?",
    icon: "warning",
    confirmButtonText: "확인",
    confirmButtonColor: "#03C777",
    showCancelButton: true,
    cancelButtonText: "취소",
    cancelButtonColor: "#F40000",
  }),
  // 그룹 타이머 삭제 실패
  failToDeleteTimer: addCustomClass({
    title: "타이머 삭제 실패",
    text: "타이머 삭제를 실패했습니다. 잠시 후 다시 시도해주세요.",
    icon: "error",
    confirmButtonText: "확인",
    confirmButtonColor: "#03C777",
  }),
};
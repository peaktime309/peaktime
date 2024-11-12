export const diffInMinutes = (startTime, endTime) => {
  return Math.round((new Date(endTime) - new Date(startTime)) / (1000 * 60));
};

// 성공, 실패 여부
// 실제 종료 시각이 목표 시각을 초과한 경우 성공
export const successToHiking = (endTime, realEndTime) => {
  return realEndTime >= endTime;
};

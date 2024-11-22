import electronApi from "./electronApi.js";

export async function endHikingProcess(sumData, startedHikingId, accessToken) {
  // window.electronAPI.sendStartMessage(null);

  //현재 시간 포맷 생성
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const hour = now.getHours();
  const minute = now.getMinutes();
  const second = now.getSeconds();

  const format = `${year}-${("00" + month.toString()).slice(-2)}-${(
    "00" + day.toString()
  ).slice(-2)} ${("00" + hour.toString()).slice(-2)}:${(
    "00" + minute.toString()
  ).slice(-2)}:${("00" + (second + 1).toString()).slice(-2)}`;

  // 보낼 데이터 패키징
  const endHikingData = {
    realEndTime: format,
    contentList: sumData,
  };
  // await setBaseUrl();

  return electronApi
    .put(`/${startedHikingId}`, endHikingData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((response) => {
      console.log("끝내기 api 결과 : ", response);
      return "done";
    })
    .catch((error) => {
      console.log(error);
    });
}

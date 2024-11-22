let isTimerRunning = false;

onmessage = function (e) {
  const { type, duration } = e.data;

  if (type === "start") {
    playTimer(duration);
  } else if (type === "pause") {
    pauseTimer();
  }
};

const playTimer = (_duration) => {
  if (isTimerRunning) return; // 이미 타이머가 실행 중이면 종료
  let duration = _duration;
  let prev = Date.now();
  isTimerRunning = true;

  const step = () => {
    if (!isTimerRunning) return; // 타이머가 종료되었으면 더 이상 실행하지 않음

    duration = duration - 1;

    if (duration <= 0) {
      isTimerRunning = false;
      postMessage({ type: "end" }); // 종료 메시지 전송
      return; // 타이머 종료 후 더 이상 실행하지 않음
    }

    const now = Date.now();
    const diff = now - prev;
    const nextAt = 1000 - (diff - 1000); // 다음 실행까지의 시간 조정
    prev = now;
    postMessage({ type: "step" });
    setTimeout(step, nextAt); // 다음 step 호출
  };

  setTimeout(step, 1000); // 첫 번째 step 호출
};

const pauseTimer = () => {
  isTimerRunning = false; // 타이머를 멈춤
  postMessage({ type: "end" }); // 종료 메시지 전송
};

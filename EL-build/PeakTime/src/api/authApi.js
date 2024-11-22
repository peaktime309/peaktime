import axios from "axios";
import { useUserStore } from "../stores/UserStore";

// axios 객체 만들기
const authApi = axios.create({
  baseURL: `${import.meta.env.VITE_BACK_URL}/api/v1/auth`,
});

// 응답 인터셉터 추가하기 (로그인 화면으로 리다이렉트)
authApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.error("API 응답 오류", error);
    if (error.response) {
      // 에러 코드 추출
      const status = error.response.data.status;
      if (status === 401) { // Auth Domain에는 로그아웃 API가 존재하기 때문에 401 에러 코드가 발생 가능
        // JWT Token 재발급 API 요청
        await authApi.post("/token/reissue", null)
          .then((response) => {
            const accessToken = response.data.data.accessToken;
            // Access Token을 Zustand(Store)와 LocalStorage에 저장
            const { user, userActions } = useUserStore.getState();
            userActions.setUser({ ...user, accessToken: accessToken });
            localStorage.setItem("user", user);
            // 성공했다면 Refresh Token은 브라우저의 쿠키 저장소에 저장되어 있을 것이다.
            // 다시 이어서 기존 API 재요청 시도하기
            let originalRequest = error.config; // 기존 요청 정보 복사
            originalRequest.headers.Authorization = `Bearer ${accessToken}`; // 새로운 Access Token을 헤더에 추가
            return authApi(originalRequest); // 기존 API 요청 재시도
          })
          .catch((error) => {
            console.error("JWT 재발급 API 요청 실패 - Refresh Token이 유효하지 않음", error);
            // Zustand(Store)에 존재하는 Access Token 삭제
            const { userActions } = useUserStore.getState();
            userActions.setUser(null);
            // LocalStorage에 존재하는 Access Token 삭제
            localStorage.removeItem("user");
            // 로그인 페이지로 강제 라우팅
            window.location.href = "/login";
            return;
          });
      } else { // 여기는 에러 코드가 401이 아닌 모든 에러 코드 처리
        console.log(status);
      }
    } else if (error.request) {
      console.error("No response received from the server:", error.request);
    } else {
      console.error("Error setting up request:", error.message);
    }
    return Promise.reject(error);
  }
);

export default authApi;

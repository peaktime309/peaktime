import axios from "axios";
import { useUserStore } from "../stores/UserStore";

// zustand 스토어에서 상태 가져오기
const getUserState = useUserStore.getState;

// axios 객체 만들기
const childrenApi = axios.create({
  baseURL: `${import.meta.env.VITE_BACK_URL}/api/v1/children`,
}); // BASE_URL/api/vi/directories?category={category}

// axios 객체에 요청 인터셉터 추가하기 (헤더에 JWT Token 삽입하기)
childrenApi.interceptors.request.use(
  (config) => {
    const { user } = getUserState();
    const accessToken = user.accessToken;

    if (accessToken && accessToken !== "") {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// axios 객체에 응답 인터셉터 추가하기 (로그인 화면으로 보내기)
childrenApi.interceptors.response.use(
  (response) => response,
  (error) => {
    //권한 오류 발생 시
    console.error("요청 응답 오류", error);
    console.log("error", error.response.data);
    const status = error.response.status;

    // 사용자 인증이 실패한 경우, 로그인 페이지로 리다이렉트
    if (status === 401) {
      // store.dispatch(setAccessToken(""));
      useUserStore.getState().userActions.setUser(null);
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    // 요청이 만들어졌지만 서버로부터 응답이 없을 때, error.request에 요청 정보가 들어간다.
    else if (error.request) {
      console.error("No response received from the server:", error.request);
    }
    // 그 외의 에러 메시지를 처리
    else {
      console.error("Error setting up request:", error.message);
    }
    return Promise.reject(error);
  }
);

export default childrenApi;

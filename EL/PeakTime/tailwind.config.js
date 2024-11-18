// tailwind.config.js
import flowbite from "flowbite/plugin";

export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // 프로젝트 파일 경로
    "./node_modules/flowbite/**/*.js", // Flowbite 모듈 경로 추가
  ],
  theme: {
    extend: {},
  },
  plugins: [
    flowbite, // Flowbite 플러그인 추가
  ],
};

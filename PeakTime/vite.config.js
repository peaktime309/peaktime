import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: "./postcss.config.js", // PostCSS 설정 파일 경로
  },
  server: {
    historyApiFallback: true, // SPA에서 히스토리 API를 사용할 때 모든 요청을 index.html로 리디렉션
  },
});

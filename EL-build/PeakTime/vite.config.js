import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import fs from "fs";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(), // React 플러그인
    {
      name: "copy-electron-folder", // 커스텀 플러그인 이름
      closeBundle() {
        // Vite 빌드 후 electron 폴더를 dist/build로 복사
        const electronFolder = path.resolve(__dirname, "electron");
        const buildFolder = path.resolve(__dirname, "dist/build");

        // electron 폴더가 존재하면 복사
        if (fs.existsSync(electronFolder)) {
          // build 폴더 안에 electron 폴더가 없으면 생성
          const electronBuildFolder = path.join(buildFolder, "electron");
          if (!fs.existsSync(electronBuildFolder)) {
            fs.mkdirSync(electronBuildFolder);
          }

          // electron 폴더 안의 모든 파일을 dist/build/electron으로 복사
          fs.readdirSync(electronFolder).forEach((file) => {
            const source = path.join(electronFolder, file);
            const destination = path.join(electronBuildFolder, file);
            // 파일 복사
            fs.copyFileSync(source, destination);
          });
        }
      },
    },
  ],
  base: "./",
  build: {
    outDir: "dist/build", // 빌드 결과물이 dist/build에 저장됩니다.
    emptyOutDir: true, // 빌드 전에 dist/build 폴더를 비웁니다.
    rollupOptions: {
      input: path.resolve(__dirname, "index.html"),
    },
  },
  css: {
    postcss: "./postcss.config.js", // PostCSS 설정 파일 경로
  },
  server: {
    historyApiFallback: true, // SPA에서 히스토리 API를 사용할 때 모든 요청을 index.html로 리디렉션
  },
});

// node express 서버
import express from "express";
// 파일 경로 다룰 때 사용하는 node.js 내장 모듈
import path from "path";
// ES 모듈(import)에서 __dirname을 사용하기 위한 변환 함수
import { fileURLToPath } from "url";

// ES 모듈에선 __dirname 이 commonJS 이므로 이 방식 사용
// 현재 파일의 전체 경로
const __filename = fileURLToPath(import.meta.url);
// 현재 파일이 있는 디렉토리 경로
const __dirname = path.dirname(__filename);

// express 서버 생성
const app = express();
// 포트 생성
const PORT = 3000;

// 정적 파일 서비스 제공
app.use(express.static(path.join(__dirname, "..")));
// 모든 경로에 대해 index.html 파일 제공
app.get("/*", (_, res) => {
  res.sendFile(path.join(__dirname, "..", "index.html"));
});

// 서버 실행
app.listen(PORT, () => {
  console.log("SERVER Start");
});

/**
 * 프론트엔드 전용 서버
 *
 * 로컬 개발 환경에서 Todo 프론트엔드를 서빙하는 간단한 서버입니다.
 * localhost:3333 포트에서 실행되며, Heroku에 배포된 백엔드 API와 통신합니다.
 */

const express = require('express');
const path = require('path');

const app = express();
const PORT = 3333;

// 정적 파일 서빙
app.use(express.static(__dirname));

// 루트 경로에서 todo-frontend.html 제공
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'todo-frontend.html'));
});

// /good 경로에서도 todo-frontend.html 제공 (백엔드와 동일)
app.get('/good', (req, res) => {
  res.sendFile(path.join(__dirname, 'todo-frontend.html'));
});

// 서버 시작
app.listen(PORT, () => {
  console.log('');
  console.log('✅ 프론트엔드 서버가 시작되었습니다!');
  console.log('');
  console.log(`   🌐 로컬 주소: http://localhost:${PORT}`);
  console.log(`   🌐 네트워크 주소: http://127.0.0.1:${PORT}`);
  console.log('');
  console.log('   📡 연결된 백엔드: Heroku (https://vibe-todo-backend-app-2356eab77040.herokuapp.com)');
  console.log('');
  console.log('   💡 서버 종료: Ctrl + C');
  console.log('');
});

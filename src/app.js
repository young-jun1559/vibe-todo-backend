const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

// 미들웨어 설정
app.use(cors()); // CORS 허용 - 다른 도메인에서의 요청을 받을 수 있게 함
app.use(express.json()); // JSON 형식의 요청 본문을 파싱
app.use(express.urlencoded({ extended: true })); // URL 인코딩된 데이터 파싱
app.use(morgan('dev')); // HTTP 요청 로깅

// 기본 라우트
app.get('/', (req, res) => {
  res.json({
    message: 'Todo Backend API Server',
    version: '1.0.0',
    status: 'running'
  });
});

// Health Check 엔드포인트
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// 404 에러 핸들러
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `경로 ${req.originalUrl}을 찾을 수 없습니다.`
  });
});

// 전역 에러 핸들러
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    message: '서버에서 오류가 발생했습니다.'
  });
});

module.exports = app;


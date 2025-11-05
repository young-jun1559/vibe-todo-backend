// 환경변수 로드 (최우선으로 실행)
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');

// 환경변수 디버깅 (항상 실행)
console.log('');
console.log('🔍 환경변수 확인:');
console.log('   PORT:', process.env.PORT || '❌ 없음 (기본값 5000 사용)');
console.log('   NODE_ENV:', process.env.NODE_ENV || '❌ 없음');
console.log('   MONGO_URI:', process.env.MONGO_URI ? '✅ 설정됨' : '❌ 없음');
console.log('   MONGODB_URI:', process.env.MONGODB_URI ? '✅ 설정됨' : '❌ 없음');
console.log('   CORS_OPEN:', process.env.CORS_OPEN || '❌ 없음');
console.log('');

const app = express();
const PORT = process.env.PORT || 5000;

// 라우트 import
const apiRoutes = require('./src/routers');
const { getCorsOptions } = require('./src/middlewares/corsConfig');

// 미들웨어 설정
app.use(cors(getCorsOptions()));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// 기본 라우트
app.get('/', (req, res) => {
  res.json({
    message: 'Todo Backend API Server',
    version: '1.0.0',
    status: 'running',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Health Check 엔드포인트
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Favicon 요청 처리 (브라우저가 자동으로 요청하는 파일)
app.get('/favicon.ico', (req, res) => {
  res.status(204).end();
});

// API 라우트 연결
app.use('/api', apiRoutes);

// 404 에러 처리 (정의되지 않은 라우트)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: '요청하신 리소스를 찾을 수 없습니다.',
    path: req.originalUrl
  });
});

// 전역 에러 처리 미들웨어
app.use((err, req, res, next) => {
  console.error('❌ 서버 에러:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || '서버 내부 오류가 발생했습니다.',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// MongoDB 연결
const connectDB = async () => {
  try {
    // MONGO_URI 또는 MONGODB_URI 사용 (둘 다 지원)
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
    
    console.log('🔍 MongoDB 연결 시도...');
    
    if (!mongoUri) {
      console.error('❌ 환경변수 확인:');
      console.error('   MONGO_URI:', process.env.MONGO_URI);
      console.error('   MONGODB_URI:', process.env.MONGODB_URI);
      console.error('');
      console.error('💡 해결 방법:');
      console.error('   1. 프로젝트 루트에 .env 파일을 생성하세요');
      console.error('      위치:', process.cwd() + '\\.env');
      console.error('');
      console.error('   2. .env 파일에 다음 내용을 추가하세요:');
      console.error('      MONGO_URI="mongodb+srv://GND:dudwns9116!@cluster0.h8vx0.mongodb.net/todo-app"');
      console.error('');
      console.error('   ⚠️  주의사항:');
      console.error('      - 비밀번호에 특수문자(!)가 있으면 URL 인코딩하거나');
      console.error('        큰따옴표로 감싸주세요');
      console.error('      - ! → %21 (URL 인코딩)');
      console.error('      - 또는 MONGO_URI="..." 형식으로 큰따옴표 사용');
      console.error('');
      console.error('   3. 파일 저장 후 서버를 재시작하세요 (npm run dev)');
      console.error('');
      throw new Error('MongoDB URI가 설정되지 않았습니다.');
    }
    
    // URI 앞부분만 표시 (보안)
    const uriPreview = mongoUri.substring(0, 30) + '...';
    console.log('📡 연결 주소:', uriPreview);
    
    await mongoose.connect(mongoUri);
    console.log('✅ MongoDB 연결성공');
    console.log('📍 연결된 데이터베이스:', mongoose.connection.name);
  } catch (error) {
    console.error('❌ MongoDB 연결 실패:', error.message);
    
    if (error.message.includes('URI')) {
      console.error('');
      console.error('🔧 .env 파일 위치 확인:');
      console.error('   현재 디렉토리:', process.cwd());
      console.error('   .env 파일 경로:', process.cwd() + '/.env');
    }
    
    process.exit(1);
  }
};

// 서버 시작
const startServer = async () => {
  await connectDB();
  
  app.listen(PORT, () => {
    console.log(`✅ 서버가 포트 ${PORT}에서 실행 중입니다.`);
    console.log(`🌐 http://localhost:${PORT}`);
    console.log(`📋 Health Check: http://localhost:${PORT}/health`);
  });
};

startServer();


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
console.log('');
console.log('   [방법 1] 완전한 URI:');
console.log('   MONGO_URI:', process.env.MONGO_URI ? '✅ 설정됨' : '❌ 없음');
console.log('   MONGODB_URI:', process.env.MONGODB_URI ? '✅ 설정됨' : '❌ 없음');
console.log('');
console.log('   [방법 2] 개별 환경변수:');
console.log('   MONGODB_USERNAME:', process.env.MONGODB_USERNAME || '❌ 없음');
console.log('   MONGODB_PASSWORD:', process.env.MONGODB_PASSWORD ? '✅ 설정됨' : '❌ 없음');
console.log('   MONGODB_CLUSTER:', process.env.MONGODB_CLUSTER || '❌ 없음 (기본값 사용)');
console.log('   MONGODB_DATABASE:', process.env.MONGODB_DATABASE || '❌ 없음 (기본값 사용)');
console.log('');
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
    console.log('🔍 MongoDB 연결 시도...');
    
    let mongoUri;
    
    // 방법 1: MONGO_URI 직접 사용 (전체 URI가 제공된 경우)
    if (process.env.MONGO_URI || process.env.MONGODB_URI) {
      mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
      console.log('✅ 완전한 URI 사용');
    }
    // 방법 2: 개별 환경변수로 URI 구성 (보안 강화)
    else if (process.env.MONGODB_USERNAME && process.env.MONGODB_PASSWORD) {
      const username = encodeURIComponent(process.env.MONGODB_USERNAME);
      const password = encodeURIComponent(process.env.MONGODB_PASSWORD);
      const cluster = process.env.MONGODB_CLUSTER || 'cluster0.h8vx0.mongodb.net';
      const database = process.env.MONGODB_DATABASE || 'todo-app';
      
      mongoUri = `mongodb+srv://${username}:${password}@${cluster}/${database}`;
      console.log('✅ 개별 환경변수로 URI 구성');
    }
    else {
      console.error('');
      console.error('❌ MongoDB 환경변수가 설정되지 않았습니다!');
      console.error('');
      console.error('📋 환경변수 확인:');
      console.error('   MONGO_URI:', process.env.MONGO_URI || '❌ 없음');
      console.error('   MONGODB_USERNAME:', process.env.MONGODB_USERNAME || '❌ 없음');
      console.error('   MONGODB_PASSWORD:', process.env.MONGODB_PASSWORD ? '✅ 설정됨' : '❌ 없음');
      console.error('   MONGODB_CLUSTER:', process.env.MONGODB_CLUSTER || '❌ 없음 (기본값 사용)');
      console.error('   MONGODB_DATABASE:', process.env.MONGODB_DATABASE || '❌ 없음 (기본값 사용)');
      console.error('');
      console.error('💡 해결 방법 (둘 중 하나 선택):');
      console.error('');
      console.error('   방법 1) 완전한 URI 사용 (.env 파일):');
      console.error('      MONGO_URI="mongodb+srv://아이디:비밀번호@cluster0.h8vx0.mongodb.net/todo-app"');
      console.error('');
      console.error('   방법 2) 개별 환경변수 사용 (더 안전, .env 파일):');
      console.error('      MONGODB_USERNAME=GND');
      console.error('      MONGODB_PASSWORD=dudwns9116!');
      console.error('      MONGODB_CLUSTER=cluster0.h8vx0.mongodb.net');
      console.error('      MONGODB_DATABASE=todo-app');
      console.error('');
      console.error('   ⚠️ Heroku Config Vars에도 동일하게 설정하세요!');
      console.error('');
      throw new Error('MongoDB 환경변수가 설정되지 않았습니다.');
    }
    
    // URI 앞부분만 표시 (보안)
    const uriPreview = mongoUri.substring(0, 30) + '...';
    console.log('📡 연결 주소:', uriPreview);
    
    await mongoose.connect(mongoUri);
    console.log('✅ MongoDB 연결성공');
    console.log('📍 연결된 데이터베이스:', mongoose.connection.name);
  } catch (error) {
    console.error('');
    console.error('❌ MongoDB 연결 실패:', error.message);
    console.error('');
    
    if (error.message.includes('authentication failed')) {
      console.error('🔐 인증 실패: 아이디 또는 비밀번호를 확인하세요');
    } else if (error.message.includes('ENOTFOUND')) {
      console.error('🌐 클러스터 주소를 확인하세요');
    }
    
    console.error('');
    console.error('🔧 디버깅 정보:');
    console.error('   현재 디렉토리:', process.cwd());
    console.error('   .env 파일 경로:', process.cwd() + '\\.env');
    console.error('');
    
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


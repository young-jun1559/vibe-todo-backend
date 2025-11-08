const express = require('express');
const router = express.Router();
const todoRoutes = require('./todoRoutes');
const testRoutes = require('./testRoutes');

/**
 * Routers Index
 * 
 * 건축 비유: 건물의 메인 안내판 또는 디렉토리
 * 모든 라우트를 한 곳에 모아서 관리하고 연결합니다.
 */

// API 버전 정보
router.get('/', (req, res) => {
  res.json({
    message: 'Todo API v1',
    version: '1.0.0',
    endpoints: {
      todos: '/api/todos',
      test: '/api/test',
      health: '/health'
    }
  });
});

// Todo 관련 라우트 연결
router.use('/todos', todoRoutes);

// MongoDB 테스트 라우트 연결
router.use('/test', testRoutes);

module.exports = router;


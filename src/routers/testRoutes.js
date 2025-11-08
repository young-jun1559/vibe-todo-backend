/**
 * Test Routes
 * 
 * 건축 비유: 테스트 현장 출입구와 동선
 * MongoDB 테스트를 위한 다양한 경로를 정의합니다.
 */

const express = require('express');
const router = express.Router();
const testController = require('../controllers/testController');

// 🔍 연결 상태 확인
router.get('/connection', testController.checkConnection);

// ✅ Create 테스트
router.post('/create', testController.createTest);

// 📖 Read 테스트
router.get('/read', testController.readTest);

// ✏️ Update 테스트
router.put('/update', testController.updateTest);

// 🗑️ Delete 테스트
router.delete('/delete', testController.deleteTest);

// 🧹 테스트 데이터 정리
router.delete('/cleanup', testController.cleanupTest);

// 🚀 전체 CRUD 통합 테스트
router.get('/full', testController.fullTest);

module.exports = router;


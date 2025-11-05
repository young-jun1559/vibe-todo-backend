const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController');

/**
 * Todo Routes
 * 
 * 건축 비유: 건물의 길찾기 안내판이나 표지판
 * 어떤 경로(URL)로 요청이 오면 어떤 컨트롤러(관리자)가 처리할지 연결합니다.
 */

// 통계 정보 조회 (이 라우트는 /:id 보다 먼저 와야 합니다)
router.get('/stats', todoController.getTodoStats);

// 모든 할일 조회 및 생성
router.route('/')
  .get(todoController.getAllTodos)      // GET /api/todos - 모든 할일 조회
  .post(todoController.createTodo);     // POST /api/todos - 새 할일 생성

// 특정 할일 조회, 수정, 삭제
router.route('/:id')
  .get(todoController.getTodoById)      // GET /api/todos/:id - 특정 할일 조회
  .put(todoController.updateTodo)       // PUT /api/todos/:id - 할일 수정
  .delete(todoController.deleteTodo);   // DELETE /api/todos/:id - 할일 삭제

module.exports = router;


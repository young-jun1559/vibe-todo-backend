const { Todo } = require('../models');

/**
 * Todo 컨트롤러
 * 
 * 건축 비유: 건물의 관리자나 컨시어지
 * 클라이언트의 요청을 받아서 실제 데이터베이스 작업을 처리하고 결과를 반환합니다.
 */

const todoController = {
  /**
   * 모든 할일 조회
   * GET /api/todos
   */
  getAllTodos: async (req, res) => {
    try {
      const { priority, sort = '-createdAt' } = req.query;
      
      // 필터 조건 설정
      const filter = {};
      if (priority) {
        filter.priority = priority;
      }
      
      // 데이터베이스에서 할일 목록 조회
      const todos = await Todo.find(filter).sort(sort);
      
      res.status(200).json({
        success: true,
        count: todos.length,
        data: todos
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: '할일 목록을 가져오는데 실패했습니다',
        error: error.message
      });
    }
  },

  /**
   * 특정 할일 조회
   * GET /api/todos/:id
   */
  getTodoById: async (req, res) => {
    try {
      const todo = await Todo.findById(req.params.id);
      
      if (!todo) {
        return res.status(404).json({
          success: false,
          message: '할일을 찾을 수 없습니다'
        });
      }
      
      res.status(200).json({
        success: true,
        data: todo
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: '할일을 가져오는데 실패했습니다',
        error: error.message
      });
    }
  },

  /**
   * 새로운 할일 생성
   * POST /api/todos
   * 
   * 건축 비유: 새로운 방을 건물에 추가하는 것
   */
  createTodo: async (req, res) => {
    try {
      const { title, description, priority, dueDate, tags } = req.body;
      
      // 제목 유효성 검사
      if (!title || title.trim() === '') {
        return res.status(400).json({
          success: false,
          message: '할일 제목은 필수입니다'
        });
      }
      
      // 새로운 할일 생성
      const newTodo = new Todo({
        title,
        description,
        priority,
        dueDate,
        tags
      });
      
      // 데이터베이스에 저장
      const savedTodo = await newTodo.save();
      
      res.status(201).json({
        success: true,
        message: '할일이 생성되었습니다',
        data: savedTodo
      });
    } catch (error) {
      // Mongoose 유효성 검사 에러 처리
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(err => err.message);
        return res.status(400).json({
          success: false,
          message: '입력값이 올바르지 않습니다',
          errors: messages
        });
      }
      
      res.status(500).json({
        success: false,
        message: '할일 생성에 실패했습니다',
        error: error.message
      });
    }
  },

  /**
   * 할일 수정
   * PUT /api/todos/:id
   * 
   * 건축 비유: 방을 리모델링하는 것
   */
  updateTodo: async (req, res) => {
    try {
      const { title, description, priority, dueDate, tags } = req.body;
      
      // 수정할 필드만 객체에 담기
      const updateFields = {};
      if (title !== undefined) updateFields.title = title;
      if (description !== undefined) updateFields.description = description;
      if (priority !== undefined) updateFields.priority = priority;
      if (dueDate !== undefined) updateFields.dueDate = dueDate;
      if (tags !== undefined) updateFields.tags = tags;
      
      // 할일 찾아서 수정
      const updatedTodo = await Todo.findByIdAndUpdate(
        req.params.id,
        updateFields,
        { 
          new: true, // 수정된 문서를 반환
          runValidators: true // 유효성 검사 실행
        }
      );
      
      if (!updatedTodo) {
        return res.status(404).json({
          success: false,
          message: '할일을 찾을 수 없습니다'
        });
      }
      
      res.status(200).json({
        success: true,
        message: '할일이 수정되었습니다',
        data: updatedTodo
      });
    } catch (error) {
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(err => err.message);
        return res.status(400).json({
          success: false,
          message: '입력값이 올바르지 않습니다',
          errors: messages
        });
      }
      
      res.status(500).json({
        success: false,
        message: '할일 수정에 실패했습니다',
        error: error.message
      });
    }
  },


  /**
   * 할일 삭제
   * DELETE /api/todos/:id
   * 
   * 건축 비유: 방을 철거하는 것
   */
  deleteTodo: async (req, res) => {
    try {
      const deletedTodo = await Todo.findByIdAndDelete(req.params.id);
      
      if (!deletedTodo) {
        return res.status(404).json({
          success: false,
          message: '할일을 찾을 수 없습니다'
        });
      }
      
      res.status(200).json({
        success: true,
        message: '할일이 삭제되었습니다',
        data: deletedTodo
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: '할일 삭제에 실패했습니다',
        error: error.message
      });
    }
  },


  /**
   * 통계 정보 조회
   * GET /api/todos/stats
   */
  getTodoStats: async (req, res) => {
    try {
      const total = await Todo.countDocuments();
      const overdue = await Todo.countDocuments({
        dueDate: { $lt: new Date(), $ne: null }
      });
      
      // 우선순위별 통계
      const byPriority = await Todo.aggregate([
        {
          $group: {
            _id: '$priority',
            count: { $sum: 1 }
          }
        }
      ]);
      
      res.status(200).json({
        success: true,
        data: {
          total,
          overdue,
          byPriority: byPriority.reduce((acc, curr) => {
            acc[curr._id] = curr.count;
            return acc;
          }, {})
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: '통계 정보를 가져오는데 실패했습니다',
        error: error.message
      });
    }
  }
};

module.exports = todoController;


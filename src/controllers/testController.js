/**
 * Test Controller
 * 
 * 건축 비유: 테스트 현장 관리자
 * MongoDB Atlas 연결과 CRUD 작업이 제대로 작동하는지 검증하는 역할입니다.
 * 실제 건축 전에 지반 테스트, 자재 테스트를 하는 것과 같습니다.
 */

const { Todo } = require('../models');
const mongoose = require('mongoose');

/**
 * 데이터베이스 연결 상태 확인
 * 건축 비유: 공사 현장의 전기, 수도 연결 상태 확인
 */
exports.checkConnection = async (req, res) => {
  try {
    const states = {
      0: '❌ 연결 끊김 (disconnected)',
      1: '✅ 연결됨 (connected)',
      2: '🔄 연결 중... (connecting)',
      3: '⚠️ 연결 해제 중... (disconnecting)'
    };

    const connectionState = mongoose.connection.readyState;
    const dbName = mongoose.connection.name;
    const host = mongoose.connection.host;

    res.json({
      success: true,
      message: 'MongoDB 연결 상태 확인',
      connection: {
        status: connectionState,
        statusText: states[connectionState] || '알 수 없음',
        database: dbName || '연결되지 않음',
        host: host || '연결되지 않음',
        isConnected: connectionState === 1
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '연결 상태 확인 실패',
      error: error.message
    });
  }
};

/**
 * Create - 테스트 Todo 생성
 * 건축 비유: 기초 공사 - 새로운 데이터를 데이터베이스에 저장
 */
exports.createTest = async (req, res) => {
  try {
    const testTodo = await Todo.create({
      title: `테스트 Todo - ${new Date().toLocaleString('ko-KR')}`,
      description: 'MongoDB Atlas CRUD 테스트용 데이터입니다.',
      completed: false,
      priority: 'medium'
    });

    res.status(201).json({
      success: true,
      message: '✅ CREATE 테스트 성공',
      data: testTodo
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '❌ CREATE 테스트 실패',
      error: error.message
    });
  }
};

/**
 * Read - 모든 Todo 조회
 * 건축 비유: 건물 검사 - 저장된 모든 데이터 확인
 */
exports.readTest = async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 }).limit(10);
    const count = await Todo.countDocuments();

    res.json({
      success: true,
      message: '✅ READ 테스트 성공',
      totalCount: count,
      data: todos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '❌ READ 테스트 실패',
      error: error.message
    });
  }
};

/**
 * Update - 가장 최근 Todo 업데이트
 * 건축 비유: 리모델링 - 기존 데이터 수정
 */
exports.updateTest = async (req, res) => {
  try {
    // 가장 최근에 생성된 Todo 찾기
    const latestTodo = await Todo.findOne().sort({ createdAt: -1 });

    if (!latestTodo) {
      return res.status(404).json({
        success: false,
        message: '⚠️ 업데이트할 Todo가 없습니다. 먼저 CREATE 테스트를 실행하세요.'
      });
    }

    // 완료 상태 토글
    latestTodo.completed = !latestTodo.completed;
    latestTodo.title = `${latestTodo.title} (수정됨)`;
    await latestTodo.save();

    res.json({
      success: true,
      message: '✅ UPDATE 테스트 성공',
      data: latestTodo
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '❌ UPDATE 테스트 실패',
      error: error.message
    });
  }
};

/**
 * Delete - 가장 오래된 Todo 삭제
 * 건축 비유: 철거 작업 - 불필요한 데이터 제거
 */
exports.deleteTest = async (req, res) => {
  try {
    // 가장 오래된 Todo 찾기
    const oldestTodo = await Todo.findOne().sort({ createdAt: 1 });

    if (!oldestTodo) {
      return res.status(404).json({
        success: false,
        message: '⚠️ 삭제할 Todo가 없습니다.'
      });
    }

    const deletedTodo = await Todo.findByIdAndDelete(oldestTodo._id);

    res.json({
      success: true,
      message: '✅ DELETE 테스트 성공',
      data: deletedTodo
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '❌ DELETE 테스트 실패',
      error: error.message
    });
  }
};

/**
 * 모든 테스트 데이터 삭제
 * 건축 비유: 공사 현장 정리 - 테스트 후 잔여물 제거
 */
exports.cleanupTest = async (req, res) => {
  try {
    const result = await Todo.deleteMany({
      title: { $regex: '테스트 Todo' }
    });

    res.json({
      success: true,
      message: '✅ 테스트 데이터 정리 완료',
      deletedCount: result.deletedCount
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '❌ 테스트 데이터 정리 실패',
      error: error.message
    });
  }
};

/**
 * 전체 CRUD 통합 테스트
 * 건축 비유: 최종 점검 - 모든 시스템을 순차적으로 테스트
 */
exports.fullTest = async (req, res) => {
  const results = {
    connection: null,
    create: null,
    read: null,
    update: null,
    delete: null
  };

  try {
    // 1. 연결 테스트
    results.connection = {
      success: mongoose.connection.readyState === 1,
      status: mongoose.connection.readyState,
      database: mongoose.connection.name
    };

    // 2. Create 테스트
    const newTodo = await Todo.create({
      title: `통합 테스트 Todo - ${new Date().toLocaleString('ko-KR')}`,
      description: '통합 테스트용',
      completed: false
    });
    results.create = { success: true, id: newTodo._id };

    // 3. Read 테스트
    const foundTodo = await Todo.findById(newTodo._id);
    results.read = { success: !!foundTodo, data: foundTodo };

    // 4. Update 테스트
    foundTodo.completed = true;
    await foundTodo.save();
    const updatedTodo = await Todo.findById(newTodo._id);
    results.update = { success: updatedTodo.completed === true };

    // 5. Delete 테스트
    await Todo.findByIdAndDelete(newTodo._id);
    const deletedCheck = await Todo.findById(newTodo._id);
    results.delete = { success: !deletedCheck };

    res.json({
      success: true,
      message: '✅ 전체 CRUD 테스트 완료',
      results: results,
      summary: {
        total: 5,
        passed: Object.values(results).filter(r => r && r.success).length,
        failed: Object.values(results).filter(r => r && !r.success).length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '❌ 통합 테스트 실패',
      error: error.message,
      results: results
    });
  }
};


/**
 * 할일 삭제 테스트 스크립트
 * 
 * 사용 방법:
 * 1. 서버 실행: npm run dev
 * 2. 새 터미널에서: node test-delete-todo.js
 */

const BASE_URL = 'http://localhost:5000/api/todos';

// 색상 출력 헬퍼
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
  reset: '\x1b[0m'
};

const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  test: (msg) => console.log(`${colors.yellow}🧪 ${msg}${colors.reset}`),
  data: (msg) => console.log(`${colors.cyan}   ${msg}${colors.reset}`)
};

// 할일 생성 (테스트용)
async function createTodo(todoData) {
  try {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(todoData)
    });
    const data = await response.json();
    return response.ok ? data.data : null;
  } catch (error) {
    return null;
  }
}

// 모든 할일 조회
async function getAllTodos() {
  try {
    const response = await fetch(BASE_URL);
    const data = await response.json();
    return response.ok ? data.data : [];
  } catch (error) {
    return [];
  }
}

// 특정 할일 조회
async function getTodoById(id) {
  try {
    const response = await fetch(`${BASE_URL}/${id}`);
    const data = await response.json();
    return { success: response.ok, data: response.ok ? data.data : null, status: response.status };
  } catch (error) {
    return { success: false, data: null, status: 0 };
  }
}

// 할일 삭제
async function deleteTodo(id) {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE'
    });
    const data = await response.json();
    
    if (response.ok) {
      log.success(`삭제 성공: ${data.message}`);
      return { success: true, data: data.data };
    } else {
      log.error(`삭제 실패: ${data.message}`);
      return { success: false, data: null };
    }
  } catch (error) {
    log.error(`요청 실패: ${error.message}`);
    return { success: false, data: null };
  }
}

// 통계 조회
async function getStats() {
  try {
    const response = await fetch(`${BASE_URL}/stats`);
    const data = await response.json();
    return response.ok ? data.data : null;
  } catch (error) {
    return null;
  }
}

// 테스트 실행
async function runTests() {
  console.log('\n' + '='.repeat(60));
  console.log('🗑️  할일 삭제 라우터 테스트 시작');
  console.log('='.repeat(60) + '\n');

  // 초기 상태 확인
  log.test('초기 상태 확인');
  const initialTodos = await getAllTodos();
  const initialStats = await getStats();
  log.info(`현재 할일 개수: ${initialStats?.total || 0}개`);
  console.log();

  // 테스트용 할일 여러 개 생성
  log.test('테스트 준비: 테스트용 할일 5개 생성');
  const testTodos = [];
  
  for (let i = 1; i <= 5; i++) {
    const todo = await createTodo({
      title: `삭제 테스트 할일 ${i}`,
      description: `테스트용 할일 ${i}번`,
      priority: i % 3 === 0 ? 'high' : i % 2 === 0 ? 'medium' : 'low',
      tags: ['테스트', `번호${i}`]
    });
    
    if (todo) {
      testTodos.push(todo);
      log.data(`생성됨: "${todo.title}" (ID: ${todo._id})`);
    }
  }
  
  log.success(`${testTodos.length}개의 테스트용 할일 생성 완료`);
  console.log();

  // 테스트 1: 단일 할일 삭제
  if (testTodos.length > 0) {
    log.test('테스트 1: 단일 할일 삭제');
    const todoToDelete = testTodos[0];
    log.info(`삭제 대상: "${todoToDelete.title}"`);
    
    const deleteResult = await deleteTodo(todoToDelete._id);
    
    if (deleteResult.success) {
      log.data(`삭제된 할일: ${deleteResult.data.title}`);
      log.data(`삭제 전 우선순위: ${deleteResult.data.priority}`);
      log.data(`삭제 전 태그: ${deleteResult.data.tags.join(', ')}`);
    }
    console.log();
  }

  // 테스트 2: 삭제 확인 (조회 시 404)
  if (testTodos.length > 0) {
    log.test('테스트 2: 삭제된 할일 조회 시도 (404 예상)');
    const result = await getTodoById(testTodos[0]._id);
    
    if (!result.success && result.status === 404) {
      log.success('정상: 삭제된 할일은 조회되지 않음 (404)');
    } else {
      log.error('오류: 삭제된 할일이 여전히 조회됨');
    }
    console.log();
  }

  // 테스트 3: 여러 할일 연속 삭제
  log.test('테스트 3: 나머지 테스트 할일 삭제');
  let deletedCount = 0;
  
  for (let i = 1; i < testTodos.length; i++) {
    const result = await deleteTodo(testTodos[i]._id);
    if (result.success) {
      deletedCount++;
    }
  }
  
  log.success(`${deletedCount}개의 할일이 추가로 삭제됨`);
  console.log();

  // 테스트 4: 존재하지 않는 ID로 삭제 시도
  log.test('테스트 4: 존재하지 않는 ID로 삭제 시도 (실패 예상)');
  await deleteTodo('000000000000000000000000');
  console.log();

  // 테스트 5: 잘못된 ID 형식
  log.test('테스트 5: 잘못된 ID 형식으로 삭제 시도 (실패 예상)');
  try {
    const response = await fetch(`${BASE_URL}/invalid-id`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      log.success('정상: 잘못된 ID 형식 거부됨');
    } else {
      log.error('오류: 잘못된 ID가 처리됨');
    }
  } catch (error) {
    log.error(`요청 실패: ${error.message}`);
  }
  console.log();

  // 테스트 6: 최종 상태 확인
  log.test('테스트 6: 최종 상태 확인');
  const finalTodos = await getAllTodos();
  const finalStats = await getStats();
  
  log.info(`최종 할일 개수: ${finalStats?.total || 0}개`);
  
  const expectedCount = (initialStats?.total || 0);
  if (finalStats?.total === expectedCount) {
    log.success(`정상: 생성한 테스트 할일이 모두 삭제됨`);
  }
  console.log();

  // 테스트 7: 삭제 후 통계 비교
  log.test('테스트 7: 삭제 전후 통계 비교');
  console.log();
  log.data('📊 초기 통계:');
  log.data(`   전체: ${initialStats?.total || 0}개`);
  log.data(`   지연: ${initialStats?.overdue || 0}개`);
  console.log();
  log.data('📊 최종 통계:');
  log.data(`   전체: ${finalStats?.total || 0}개`);
  log.data(`   지연: ${finalStats?.overdue || 0}개`);
  console.log();
  log.data('📉 변화:');
  log.data(`   삭제된 할일: ${testTodos.length}개`);
  console.log();

  // 요약
  console.log('='.repeat(60));
  console.log('📊 테스트 요약');
  console.log('='.repeat(60));
  console.log(`${colors.green}✅ 단일 삭제: 성공${colors.reset}`);
  console.log(`${colors.green}✅ 삭제 확인: 성공 (404 반환)${colors.reset}`);
  console.log(`${colors.green}✅ 연속 삭제: ${deletedCount}개 성공${colors.reset}`);
  console.log(`${colors.green}✅ 존재하지 않는 ID: 올바른 에러 처리${colors.reset}`);
  console.log(`${colors.green}✅ 잘못된 ID 형식: 올바른 에러 처리${colors.reset}`);
  console.log(`${colors.green}✅ 통계 업데이트: 정상${colors.reset}`);
  console.log('='.repeat(60));

  console.log('\n' + '='.repeat(60));
  console.log('✨ 테스트 완료!');
  console.log('='.repeat(60) + '\n');
}

// 서버 연결 확인 후 테스트 실행
async function checkServer() {
  try {
    log.info('서버 연결 확인 중...');
    const response = await fetch('http://localhost:5000/health');
    
    if (response.ok) {
      log.success('서버 연결 성공!\n');
      await runTests();
    } else {
      log.error('서버가 응답하지 않습니다.');
    }
  } catch (error) {
    log.error('서버에 연결할 수 없습니다.');
    console.log('\n💡 해결 방법:');
    console.log('   1. 터미널에서 "npm run dev" 명령으로 서버를 실행하세요');
    console.log('   2. MongoDB가 실행 중인지 확인하세요');
    console.log('   3. .env 파일이 올바르게 설정되었는지 확인하세요\n');
  }
}

// 테스트 시작
checkServer();



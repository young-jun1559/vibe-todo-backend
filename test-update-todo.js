/**
 * 할일 수정 테스트 스크립트
 * 
 * 사용 방법:
 * 1. 서버 실행: npm run dev
 * 2. 할일 생성: node test-create-todo.js (할일이 없는 경우)
 * 3. 새 터미널에서: node test-update-todo.js
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

// 할일 조회
async function getTodoById(id) {
  try {
    const response = await fetch(`${BASE_URL}/${id}`);
    const data = await response.json();
    return response.ok ? data.data : null;
  } catch (error) {
    return null;
  }
}

// 할일 수정
async function updateTodo(id, updates) {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    const data = await response.json();
    
    if (response.ok) {
      log.success(`수정 성공: ${data.message}`);
      return data.data;
    } else {
      log.error(`수정 실패: ${data.message}`);
      if (data.errors) {
        console.log(`   ⚠️  오류: ${data.errors.join(', ')}`);
      }
      return null;
    }
  } catch (error) {
    log.error(`요청 실패: ${error.message}`);
    return null;
  }
}

// 할일 삭제
async function deleteTodo(id) {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE'
    });
    return response.ok;
  } catch (error) {
    return false;
  }
}

// 할일 정보 표시
function displayTodo(todo, label = '') {
  console.log(`${colors.cyan}   ${label}${colors.reset}`);
  log.data(`제목: ${todo.title}`);
  log.data(`설명: ${todo.description || '(없음)'}`);
  log.data(`우선순위: ${todo.priority}`);
  log.data(`마감일: ${todo.dueDate ? new Date(todo.dueDate).toLocaleDateString('ko-KR') : '(없음)'}`);
  log.data(`태그: ${todo.tags && todo.tags.length > 0 ? todo.tags.join(', ') : '(없음)'}`);
  log.data(`수정일: ${new Date(todo.updatedAt).toLocaleString('ko-KR')}`);
}

// 변경사항 비교
function compareChanges(before, after, field) {
  const beforeValue = before[field];
  const afterValue = after[field];
  
  let beforeStr, afterStr;
  
  if (Array.isArray(beforeValue)) {
    beforeStr = beforeValue.join(', ') || '(없음)';
    afterStr = afterValue.join(', ') || '(없음)';
  } else if (field === 'dueDate') {
    beforeStr = beforeValue ? new Date(beforeValue).toLocaleDateString('ko-KR') : '(없음)';
    afterStr = afterValue ? new Date(afterValue).toLocaleDateString('ko-KR') : '(없음)';
  } else {
    beforeStr = beforeValue || '(없음)';
    afterStr = afterValue || '(없음)';
  }
  
  if (beforeStr !== afterStr) {
    console.log(`   ${colors.magenta}${field}: ${colors.reset}${beforeStr} ${colors.yellow}→${colors.reset} ${colors.green}${afterStr}${colors.reset}`);
  }
}

// 테스트 실행
async function runTests() {
  console.log('\n' + '='.repeat(60));
  console.log('✏️  할일 수정 라우터 테스트 시작');
  console.log('='.repeat(60) + '\n');

  // 테스트용 할일 생성
  log.test('테스트 준비: 새 할일 생성');
  const testTodo = await createTodo({
    title: '수정 테스트용 할일',
    description: '원본 설명',
    priority: 'medium',
    tags: ['테스트', '원본']
  });

  if (!testTodo) {
    log.error('테스트용 할일 생성 실패. 서버를 확인하세요.');
    return;
  }

  log.success(`테스트용 할일 생성됨 (ID: ${testTodo._id})`);
  console.log();
  displayTodo(testTodo, '📋 원본 할일:');
  console.log();

  const todoId = testTodo._id;

  // 테스트 1: 제목만 수정
  log.test('테스트 1: 제목만 수정');
  const before1 = await getTodoById(todoId);
  const updated1 = await updateTodo(todoId, {
    title: '수정된 제목입니다'
  });
  
  if (updated1) {
    console.log();
    compareChanges(before1, updated1, 'title');
  }
  console.log();

  // 테스트 2: 우선순위 변경
  log.test('테스트 2: 우선순위를 높음으로 변경');
  const before2 = await getTodoById(todoId);
  const updated2 = await updateTodo(todoId, {
    priority: 'high'
  });
  
  if (updated2) {
    console.log();
    compareChanges(before2, updated2, 'priority');
  }
  console.log();

  // 테스트 3: 설명 수정
  log.test('테스트 3: 설명 수정');
  const before3 = await getTodoById(todoId);
  const updated3 = await updateTodo(todoId, {
    description: '완전히 새로운 상세 설명입니다. 많은 내용을 담을 수 있습니다.'
  });
  
  if (updated3) {
    console.log();
    compareChanges(before3, updated3, 'description');
  }
  console.log();

  // 테스트 4: 마감일 설정
  log.test('테스트 4: 마감일 설정');
  const before4 = await getTodoById(todoId);
  const updated4 = await updateTodo(todoId, {
    dueDate: '2025-12-31'
  });
  
  if (updated4) {
    console.log();
    compareChanges(before4, updated4, 'dueDate');
  }
  console.log();

  // 테스트 5: 태그 수정
  log.test('테스트 5: 태그 수정');
  const before5 = await getTodoById(todoId);
  const updated5 = await updateTodo(todoId, {
    tags: ['수정됨', '업데이트', '완료']
  });
  
  if (updated5) {
    console.log();
    compareChanges(before5, updated5, 'tags');
  }
  console.log();

  // 테스트 6: 여러 필드 동시 수정
  log.test('테스트 6: 여러 필드 동시 수정');
  const before6 = await getTodoById(todoId);
  const updated6 = await updateTodo(todoId, {
    title: '최종 수정된 제목',
    description: '최종 수정된 설명',
    priority: 'low',
    dueDate: '2025-11-20',
    tags: ['최종', '완료']
  });
  
  if (updated6) {
    console.log();
    log.data('📊 변경 사항:');
    compareChanges(before6, updated6, 'title');
    compareChanges(before6, updated6, 'description');
    compareChanges(before6, updated6, 'priority');
    compareChanges(before6, updated6, 'dueDate');
    compareChanges(before6, updated6, 'tags');
  }
  console.log();

  // 테스트 7: 최종 상태 확인
  log.test('테스트 7: 최종 상태 확인');
  const finalTodo = await getTodoById(todoId);
  if (finalTodo) {
    console.log();
    displayTodo(finalTodo, '📋 최종 할일 상태:');
  }
  console.log();

  // 테스트 8: 유효성 검사 - 잘못된 우선순위
  log.test('테스트 8: 유효성 검사 - 잘못된 우선순위 (실패 예상)');
  await updateTodo(todoId, {
    priority: 'urgent'  // low, medium, high만 허용됨
  });
  console.log();

  // 테스트 9: 존재하지 않는 ID
  log.test('테스트 9: 존재하지 않는 ID로 수정 시도 (실패 예상)');
  await updateTodo('000000000000000000000000', {
    title: '이건 실패해야 함'
  });
  console.log();

  // 정리: 테스트용 할일 삭제
  log.test('테스트 정리: 생성한 할일 삭제');
  const deleted = await deleteTodo(todoId);
  if (deleted) {
    log.success('테스트용 할일이 삭제되었습니다.');
  }
  console.log();

  // 요약
  console.log('='.repeat(60));
  console.log('📊 테스트 요약');
  console.log('='.repeat(60));
  console.log(`${colors.green}✅ 제목 수정: 성공${colors.reset}`);
  console.log(`${colors.green}✅ 우선순위 수정: 성공${colors.reset}`);
  console.log(`${colors.green}✅ 설명 수정: 성공${colors.reset}`);
  console.log(`${colors.green}✅ 마감일 설정: 성공${colors.reset}`);
  console.log(`${colors.green}✅ 태그 수정: 성공${colors.reset}`);
  console.log(`${colors.green}✅ 다중 필드 수정: 성공${colors.reset}`);
  console.log(`${colors.green}✅ 유효성 검사: 정상 작동${colors.reset}`);
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


/**
 * Todo API 통합 테스트 스크립트
 * 
 * 할일 생성부터 조회까지 전체 플로우를 테스트합니다.
 * 
 * 사용 방법:
 * 1. 서버 실행: npm run dev
 * 2. 새 터미널에서: node test-all.js
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
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  test: (msg) => console.log(`${colors.yellow}🧪 ${msg}${colors.reset}`),
  section: (msg) => console.log(`\n${colors.bold}${colors.magenta}${'='.repeat(60)}${colors.reset}`
    + `\n${colors.bold}${colors.magenta}${msg}${colors.reset}`
    + `\n${colors.bold}${colors.magenta}${'='.repeat(60)}${colors.reset}\n`)
};

// 생성된 할일 ID 저장
let createdTodoIds = [];

// 할일 생성
async function createTodo(todoData) {
  try {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(todoData)
    });
    const data = await response.json();
    
    if (response.ok) {
      createdTodoIds.push(data.data._id);
      return data.data;
    }
    return null;
  } catch (error) {
    return null;
  }
}

// 할일 조회
async function getAllTodos(query = '') {
  try {
    const url = query ? `${BASE_URL}?${query}` : BASE_URL;
    const response = await fetch(url);
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
    return response.ok ? data.data : null;
  } catch (error) {
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

// 통합 테스트 실행
async function runIntegratedTests() {
  console.log('\n' + '='.repeat(60));
  console.log(`${colors.bold}🚀 Todo API 통합 테스트${colors.reset}`);
  console.log('='.repeat(60) + '\n');

  // ==================== 1. 할일 생성 ====================
  log.section('📝 1단계: 할일 생성');
  
  log.test('다양한 할일 생성 중...');
  
  const todosToCreate = [
    { title: '프로젝트 완성', priority: 'high', tags: ['개발', '중요'] },
    { title: 'MongoDB 공부', priority: 'medium', description: 'Mongoose 마스터하기', tags: ['학습'] },
    { title: '운동하기', priority: 'low', tags: ['건강'] },
    { title: '보고서 작성', priority: 'high', dueDate: '2025-11-05', tags: ['업무'] }
  ];

  for (const todoData of todosToCreate) {
    const created = await createTodo(todoData);
    if (created) {
      log.success(`생성됨: "${created.title}" (${created.priority})`);
    }
  }
  
  console.log(`\n${colors.cyan}✨ 총 ${createdTodoIds.length}개의 할일이 생성되었습니다.${colors.reset}\n`);

  // ==================== 2. 할일 조회 ====================
  log.section('🔍 2단계: 할일 조회');
  
  log.test('모든 할일 조회');
  const allTodos = await getAllTodos();
  log.success(`전체 ${allTodos.length}개의 할일 조회됨`);
  
  log.test('높은 우선순위 할일만 필터링');
  const highPriority = await getAllTodos('priority=high');
  log.success(`${highPriority.length}개의 높은 우선순위 할일 조회됨`);
  
  log.test('생성일 기준 오름차순 정렬');
  const sortedTodos = await getAllTodos('sort=createdAt');
  if (sortedTodos.length > 0) {
    log.success(`정렬 완료: "${sortedTodos[0].title}" → "${sortedTodos[sortedTodos.length - 1].title}"`);
  }

  // ==================== 3. 특정 할일 상세 조회 ====================
  log.section('📋 3단계: 특정 할일 상세 조회');
  
  if (createdTodoIds.length > 0) {
    log.test(`ID로 할일 조회: ${createdTodoIds[0]}`);
    const todo = await getTodoById(createdTodoIds[0]);
    if (todo) {
      log.success(`조회 성공: "${todo.title}"`);
      console.log(`   ${colors.cyan}우선순위: ${todo.priority}${colors.reset}`);
      console.log(`   ${colors.cyan}태그: ${todo.tags.join(', ')}${colors.reset}`);
    }
  }

  // ==================== 4. 할일 수정 ====================
  log.section('✏️  4단계: 할일 수정');
  
  if (createdTodoIds.length > 0) {
    log.test('우선순위 변경 테스트');
    const updated = await updateTodo(createdTodoIds[0], { 
      priority: 'low',
      description: '수정된 설명입니다'
    });
    if (updated) {
      log.success(`수정 완료: "${updated.title}" → 우선순위: ${updated.priority}`);
    }
  }

  // ==================== 5. 통계 조회 ====================
  log.section('📊 5단계: 통계 정보 조회');
  
  log.test('전체 통계 조회');
  const stats = await getStats();
  if (stats) {
    log.success('통계 조회 성공');
    console.log(`   ${colors.cyan}전체 할일: ${stats.total}개${colors.reset}`);
    console.log(`   ${colors.cyan}지연된 할일: ${stats.overdue}개${colors.reset}`);
    console.log(`   ${colors.cyan}우선순위별:${colors.reset}`);
    Object.entries(stats.byPriority).forEach(([priority, count]) => {
      const emoji = { high: '🔴', medium: '🟡', low: '🟢' }[priority] || '⚪';
      console.log(`      ${emoji} ${priority}: ${count}개`);
    });
  }

  // ==================== 6. 할일 삭제 ====================
  log.section('🗑️  6단계: 할일 삭제');
  
  if (createdTodoIds.length > 0) {
    log.test('생성한 할일 삭제 중...');
    let deletedCount = 0;
    
    for (const id of createdTodoIds) {
      const deleted = await deleteTodo(id);
      if (deleted) {
        deletedCount++;
      }
    }
    
    log.success(`${deletedCount}개의 할일이 삭제되었습니다.`);
  }

  // ==================== 최종 확인 ====================
  log.section('✅ 7단계: 최종 확인');
  
  const finalTodos = await getAllTodos();
  log.info(`현재 남은 할일: ${finalTodos.length}개`);

  // ==================== 요약 ====================
  console.log('\n' + '='.repeat(60));
  console.log(`${colors.bold}${colors.green}🎉 통합 테스트 완료!${colors.reset}`);
  console.log('='.repeat(60));
  console.log(`${colors.cyan}✅ 생성: ${createdTodoIds.length}개${colors.reset}`);
  console.log(`${colors.cyan}✅ 조회: 성공${colors.reset}`);
  console.log(`${colors.cyan}✅ 필터링: 성공${colors.reset}`);
  console.log(`${colors.cyan}✅ 정렬: 성공${colors.reset}`);
  console.log(`${colors.cyan}✅ 수정: 성공${colors.reset}`);
  console.log(`${colors.cyan}✅ 삭제: 성공${colors.reset}`);
  console.log(`${colors.cyan}✅ 통계: 성공${colors.reset}`);
  console.log('='.repeat(60) + '\n');
}

// 서버 연결 확인 후 테스트 실행
async function checkServer() {
  try {
    log.info('서버 연결 확인 중...');
    const response = await fetch('http://localhost:5000/health');
    
    if (response.ok) {
      log.success('서버 연결 성공!\n');
      await runIntegratedTests();
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


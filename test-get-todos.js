/**
 * 할일 조회 테스트 스크립트
 * 
 * 사용 방법:
 * 1. 서버 실행: npm run dev
 * 2. 새 터미널에서: node test-get-todos.js
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

// 할일 목록 조회
async function getAllTodos(query = '') {
  try {
    const url = query ? `${BASE_URL}?${query}` : BASE_URL;
    const response = await fetch(url);
    const data = await response.json();
    
    if (response.ok) {
      log.success(`할일 목록 조회 성공: ${data.count}개`);
      return data.data;
    } else {
      log.error(`조회 실패: ${data.message}`);
      return [];
    }
  } catch (error) {
    log.error(`요청 실패: ${error.message}`);
    return [];
  }
}

// 특정 할일 조회
async function getTodoById(id) {
  try {
    const response = await fetch(`${BASE_URL}/${id}`);
    const data = await response.json();
    
    if (response.ok) {
      log.success(`할일 조회 성공`);
      return data.data;
    } else {
      log.error(`조회 실패: ${data.message}`);
      return null;
    }
  } catch (error) {
    log.error(`요청 실패: ${error.message}`);
    return null;
  }
}

// 통계 정보 조회
async function getStats() {
  try {
    const response = await fetch(`${BASE_URL}/stats`);
    const data = await response.json();
    
    if (response.ok) {
      log.success('통계 정보 조회 성공');
      return data.data;
    } else {
      log.error(`조회 실패: ${data.message}`);
      return null;
    }
  } catch (error) {
    log.error(`요청 실패: ${error.message}`);
    return null;
  }
}

// 할일 표시 헬퍼
function displayTodo(todo, index) {
  const priorityEmoji = {
    high: '🔴',
    medium: '🟡',
    low: '🟢'
  };
  
  const emoji = priorityEmoji[todo.priority] || '⚪';
  console.log(`   ${index + 1}. ${emoji} [${todo.priority.toUpperCase()}] ${todo.title}`);
  
  if (todo.description) {
    log.data(`      📝 ${todo.description}`);
  }
  
  if (todo.tags && todo.tags.length > 0) {
    log.data(`      🏷️  태그: ${todo.tags.join(', ')}`);
  }
  
  if (todo.dueDate) {
    const date = new Date(todo.dueDate);
    log.data(`      📅 마감일: ${date.toLocaleDateString('ko-KR')}`);
  }
  
  log.data(`      🆔 ID: ${todo._id}`);
  log.data(`      ⏰ 생성: ${new Date(todo.createdAt).toLocaleString('ko-KR')}`);
}

// 테스트 실행
async function runTests() {
  console.log('\n' + '='.repeat(60));
  console.log('🔍 할일 조회 라우터 테스트 시작');
  console.log('='.repeat(60) + '\n');

  // 테스트 1: 모든 할일 조회
  log.test('테스트 1: 모든 할일 조회');
  const allTodos = await getAllTodos();
  
  if (allTodos.length > 0) {
    console.log();
    allTodos.forEach((todo, index) => displayTodo(todo, index));
  } else {
    log.info('   할일이 없습니다. test-create-todo.js를 먼저 실행하세요.');
  }
  console.log();

  // 테스트 2: 우선순위별 필터링
  log.test('테스트 2: 높은 우선순위 할일만 조회');
  const highPriority = await getAllTodos('priority=high');
  if (highPriority.length > 0) {
    console.log();
    highPriority.forEach((todo, index) => displayTodo(todo, index));
  } else {
    log.info('   높은 우선순위 할일이 없습니다.');
  }
  console.log();

  log.test('테스트 3: 중간 우선순위 할일만 조회');
  const mediumPriority = await getAllTodos('priority=medium');
  if (mediumPriority.length > 0) {
    console.log();
    mediumPriority.forEach((todo, index) => displayTodo(todo, index));
  } else {
    log.info('   중간 우선순위 할일이 없습니다.');
  }
  console.log();

  log.test('테스트 4: 낮은 우선순위 할일만 조회');
  const lowPriority = await getAllTodos('priority=low');
  if (lowPriority.length > 0) {
    console.log();
    lowPriority.forEach((todo, index) => displayTodo(todo, index));
  } else {
    log.info('   낮은 우선순위 할일이 없습니다.');
  }
  console.log();

  // 테스트 5: 정렬
  log.test('테스트 5: 생성일 기준 오름차순 정렬');
  const sortedAsc = await getAllTodos('sort=createdAt');
  if (sortedAsc.length > 0) {
    log.data(`   가장 오래된 할일: ${sortedAsc[0].title}`);
    log.data(`   가장 최근 할일: ${sortedAsc[sortedAsc.length - 1].title}`);
  }
  console.log();

  // 테스트 6: 특정 할일 조회
  if (allTodos.length > 0) {
    log.test('테스트 6: 특정 할일 상세 조회');
    const firstTodo = allTodos[0];
    const todo = await getTodoById(firstTodo._id);
    
    if (todo) {
      console.log();
      log.data(`📋 할일 상세 정보:`);
      log.data(`   제목: ${todo.title}`);
      log.data(`   설명: ${todo.description || '(없음)'}`);
      log.data(`   우선순위: ${todo.priority}`);
      log.data(`   태그: ${todo.tags.join(', ') || '(없음)'}`);
      log.data(`   마감일: ${todo.dueDate ? new Date(todo.dueDate).toLocaleDateString('ko-KR') : '(없음)'}`);
      log.data(`   생성일: ${new Date(todo.createdAt).toLocaleString('ko-KR')}`);
      log.data(`   수정일: ${new Date(todo.updatedAt).toLocaleString('ko-KR')}`);
    }
    console.log();
  }

  // 테스트 7: 통계 정보
  log.test('테스트 7: 통계 정보 조회');
  const stats = await getStats();
  
  if (stats) {
    console.log();
    log.data(`📊 전체 통계:`);
    log.data(`   전체 할일: ${stats.total}개`);
    log.data(`   지연된 할일: ${stats.overdue}개`);
    log.data(``);
    log.data(`📈 우선순위별 통계:`);
    
    const priorities = { high: '높음', medium: '중간', low: '낮음' };
    Object.entries(stats.byPriority).forEach(([priority, count]) => {
      const emoji = { high: '🔴', medium: '🟡', low: '🟢' }[priority] || '⚪';
      log.data(`   ${emoji} ${priorities[priority]}: ${count}개`);
    });
  }
  console.log();

  // 테스트 8: 필터 + 정렬 조합
  log.test('테스트 8: 높은 우선순위 + 생성일 내림차순');
  const filtered = await getAllTodos('priority=high&sort=-createdAt');
  if (filtered.length > 0) {
    log.info(`   ${filtered.length}개의 할일이 조회되었습니다.`);
    console.log();
    filtered.slice(0, 3).forEach((todo, index) => displayTodo(todo, index));
  } else {
    log.info('   해당하는 할일이 없습니다.');
  }
  console.log();

  // 요약
  console.log('='.repeat(60));
  console.log('📊 테스트 요약');
  console.log('='.repeat(60));
  console.log(`${colors.cyan}   전체 할일: ${allTodos.length}개${colors.reset}`);
  console.log(`${colors.red}   높은 우선순위: ${highPriority.length}개${colors.reset}`);
  console.log(`${colors.yellow}   중간 우선순위: ${mediumPriority.length}개${colors.reset}`);
  console.log(`${colors.green}   낮은 우선순위: ${lowPriority.length}개${colors.reset}`);
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
    console.log('   3. .env 파일이 올바르게 설정되었는지 확인하세요');
    console.log('   4. 할일이 없다면 "node test-create-todo.js"를 먼저 실행하세요\n');
  }
}

// 테스트 시작
checkServer();


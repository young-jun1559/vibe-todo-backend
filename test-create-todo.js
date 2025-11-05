/**
 * Todo 생성 테스트 스크립트
 * 
 * 사용 방법:
 * 1. 서버 실행: npm run dev
 * 2. 새 터미널에서: node test-create-todo.js
 */

const BASE_URL = 'http://localhost:5000/api/todos';

// 색상 출력 헬퍼
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  test: (msg) => console.log(`${colors.yellow}🧪 ${msg}${colors.reset}`)
};

// 할일 생성 함수
async function createTodo(todoData) {
  try {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(todoData)
    });

    const data = await response.json();
    
    if (response.ok) {
      log.success(`할일 생성 성공: "${data.data.title}"`);
      console.log('   📋 상세 정보:', {
        id: data.data._id,
        priority: data.data.priority,
        tags: data.data.tags,
        createdAt: data.data.createdAt
      });
      return data.data;
    } else {
      log.error(`할일 생성 실패: ${data.message}`);
      if (data.errors) {
        console.log('   ⚠️  오류:', data.errors);
      }
      return null;
    }
  } catch (error) {
    log.error(`요청 실패: ${error.message}`);
    return null;
  }
}

// 모든 할일 조회
async function getAllTodos() {
  try {
    const response = await fetch(BASE_URL);
    const data = await response.json();
    
    if (response.ok) {
      log.info(`전체 할일 개수: ${data.count}개`);
      return data.data;
    }
  } catch (error) {
    log.error(`조회 실패: ${error.message}`);
  }
}

// 테스트 실행
async function runTests() {
  console.log('\n' + '='.repeat(60));
  console.log('🚀 Todo 생성 라우터 테스트 시작');
  console.log('='.repeat(60) + '\n');

  // 테스트 1: 기본 할일 생성
  log.test('테스트 1: 기본 할일 생성 (제목만)');
  await createTodo({
    title: '첫 번째 할일'
  });
  console.log();

  // 테스트 2: 모든 필드 포함
  log.test('테스트 2: 모든 필드를 포함한 할일 생성');
  await createTodo({
    title: '프로젝트 완성하기',
    description: 'Todo 백엔드 API 개발 및 테스트',
    priority: 'high',
    dueDate: '2025-11-10',
    tags: ['개발', '프로젝트', '중요']
  });
  console.log();

  // 테스트 3: 낮은 우선순위
  log.test('테스트 3: 우선순위가 낮은 할일');
  await createTodo({
    title: '주말에 영화보기',
    description: '넷플릭스에서 추천 영화 보기',
    priority: 'low',
    tags: ['여가', '휴식']
  });
  console.log();

  // 테스트 4: 마감일 포함
  log.test('테스트 4: 마감일이 있는 긴급 할일');
  await createTodo({
    title: '보고서 제출',
    description: '월말 보고서 작성 및 제출',
    priority: 'high',
    dueDate: '2025-11-05T23:59:59.000Z',
    tags: ['업무', '긴급']
  });
  console.log();

  // 테스트 5: 중간 우선순위 (기본값)
  log.test('테스트 5: 기본 우선순위 (medium) 할일');
  await createTodo({
    title: '장보기',
    description: '마트에서 식료품 구매',
    tags: ['생활']
  });
  console.log();

  // 테스트 6: 유효성 검사 - 제목 없음 (실패해야 함)
  log.test('테스트 6: 유효성 검사 - 제목 없음 (실패 예상)');
  await createTodo({
    description: '제목이 없는 할일'
  });
  console.log();

  // 테스트 7: 유효성 검사 - 잘못된 우선순위 (실패해야 함)
  log.test('테스트 7: 유효성 검사 - 잘못된 우선순위 (실패 예상)');
  await createTodo({
    title: '테스트 할일',
    priority: 'urgent'  // low, medium, high만 허용됨
  });
  console.log();

  // 생성된 할일 목록 조회
  log.test('테스트 8: 생성된 모든 할일 조회');
  const todos = await getAllTodos();
  if (todos && todos.length > 0) {
    console.log('\n📋 할일 목록:');
    todos.forEach((todo, index) => {
      console.log(`   ${index + 1}. [${todo.priority.toUpperCase()}] ${todo.title}`);
    });
  }

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


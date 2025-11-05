# 📋 Todo Backend API 가이드

## 🎯 데이터베이스 구조 설명

### Todo 모델 (컬렉션)

건축 비유로 설명하자면, Todo 모델은 **할일을 보관하는 서랍장**입니다. 각 서랍(필드)에는 특정한 정보가 저장됩니다.

| 필드명 | 타입 | 필수 | 설명 | 비유 |
|--------|------|------|------|------|
| `title` | String | ✅ | 할일 제목 (1~200자) | 서랍의 라벨 - 무엇이 들어있는지 표시 |
| `description` | String | ❌ | 할일 상세 설명 (최대 1000자) | 서랍 안의 메모 - 자세한 내용 |
| `priority` | String | ❌ | 우선순위 (low/medium/high, 기본값: medium) | 중요도 스티커 - 얼마나 중요한지 |
| `dueDate` | Date | ❌ | 마감일 | 달력 - 언제까지 해야하는지 |
| `tags` | Array[String] | ❌ | 태그 목록 | 카테고리 라벨 - 분류용 |
| `createdAt` | Date | 자동 | 생성 일시 | 서랍을 만든 날짜 |
| `updatedAt` | Date | 자동 | 수정 일시 | 서랍을 마지막으로 정리한 날짜 |

---

## 🚀 시작하기

### 1. 환경 설정

`.env` 파일을 생성하고 MongoDB 연결 정보를 입력하세요:

\`\`\`bash
cp .env.example .env
\`\`\`

`.env` 파일 내용:
\`\`\`env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/todo-app
NODE_ENV=development
\`\`\`

### 2. 서버 실행

\`\`\`bash
# 개발 모드 (자동 재시작)
npm run dev

# 프로덕션 모드
npm start
\`\`\`

서버가 실행되면 다음과 같이 표시됩니다:
\`\`\`
✅ MongoDB 연결성공
✅ 서버가 포트 5000에서 실행 중입니다.
🌐 http://localhost:5000
📋 Health Check: http://localhost:5000/health
\`\`\`

---

## 📡 API 엔드포인트

기본 URL: `http://localhost:5000/api`

### 1. 모든 할일 조회
**GET** `/api/todos`

**쿼리 파라미터:**
- `priority`: 우선순위 필터 (low/medium/high)
- `sort`: 정렬 기준 (기본값: -createdAt)

**예시:**
\`\`\`bash
# 모든 할일 조회
curl http://localhost:5000/api/todos

# 높은 우선순위 할일만 조회
curl http://localhost:5000/api/todos?priority=high

# 생성일 기준 오름차순 정렬
curl http://localhost:5000/api/todos?sort=createdAt
\`\`\`

**응답 예시:**
\`\`\`json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "654abc123def456789012345",
      "title": "프로젝트 완성하기",
      "description": "Todo 백엔드 API 개발",
      "priority": "high",
      "dueDate": "2025-11-10T00:00:00.000Z",
      "tags": ["개발", "프로젝트"],
      "createdAt": "2025-11-02T10:30:00.000Z",
      "updatedAt": "2025-11-02T10:30:00.000Z"
    }
  ]
}
\`\`\`

---

### 2. 특정 할일 조회
**GET** `/api/todos/:id`

**예시:**
\`\`\`bash
curl http://localhost:5000/api/todos/654abc123def456789012345
\`\`\`

---

### 3. 새로운 할일 생성
**POST** `/api/todos`

**요청 본문:**
\`\`\`json
{
  "title": "MongoDB 공부하기",
  "description": "Mongoose 스키마와 모델 익히기",
  "priority": "high",
  "dueDate": "2025-11-05",
  "tags": ["학습", "데이터베이스"]
}
\`\`\`

**예시:**
\`\`\`bash
curl -X POST http://localhost:5000/api/todos \\
  -H "Content-Type: application/json" \\
  -d '{
    "title": "MongoDB 공부하기",
    "description": "Mongoose 스키마와 모델 익히기",
    "priority": "high",
    "tags": ["학습", "데이터베이스"]
  }'
\`\`\`

**응답 예시:**
\`\`\`json
{
  "success": true,
  "message": "할일이 생성되었습니다",
  "data": {
    "_id": "654abc123def456789012345",
    "title": "MongoDB 공부하기",
    "description": "Mongoose 스키마와 모델 익히기",
    "priority": "high",
    "dueDate": null,
    "tags": ["학습", "데이터베이스"],
    "createdAt": "2025-11-02T10:30:00.000Z",
    "updatedAt": "2025-11-02T10:30:00.000Z"
  }
}
\`\`\`

---

### 4. 할일 수정
**PUT** `/api/todos/:id`

**요청 본문 (수정할 필드만 포함):**
\`\`\`json
{
  "title": "MongoDB 완벽하게 공부하기",
  "priority": "low",
  "dueDate": "2025-11-15"
}
\`\`\`

**예시:**
\`\`\`bash
curl -X PUT http://localhost:5000/api/todos/654abc123def456789012345 \\
  -H "Content-Type: application/json" \\
  -d '{
    "title": "MongoDB 완벽하게 공부하기",
    "priority": "low"
  }'
\`\`\`

---

### 5. 할일 삭제
**DELETE** `/api/todos/:id`

**예시:**
\`\`\`bash
curl -X DELETE http://localhost:5000/api/todos/654abc123def456789012345
\`\`\`

---

### 6. 통계 정보 조회
**GET** `/api/todos/stats`

**예시:**
\`\`\`bash
curl http://localhost:5000/api/todos/stats
\`\`\`

**응답 예시:**
\`\`\`json
{
  "success": true,
  "data": {
    "total": 10,
    "overdue": 2,
    "byPriority": {
      "high": 3,
      "medium": 5,
      "low": 2
    }
  }
}
\`\`\`

---

## 🎨 프론트엔드 연동 예시

### JavaScript (Fetch API)

\`\`\`javascript
// 할일 목록 조회
async function getTodos() {
  const response = await fetch('http://localhost:5000/api/todos');
  const data = await response.json();
  console.log(data.data); // 할일 목록
}

// 새로운 할일 생성
async function createTodo(title, description) {
  const response = await fetch('http://localhost:5000/api/todos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      title,
      description,
      priority: 'medium'
    })
  });
  const data = await response.json();
  console.log(data.data); // 생성된 할일
}

// 할일 우선순위 변경
async function updateTodoPriority(id, priority) {
  const response = await fetch(\`http://localhost:5000/api/todos/\${id}\`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ priority })
  });
  const data = await response.json();
  console.log(data.data); // 업데이트된 할일
}

// 할일 삭제
async function deleteTodo(id) {
  const response = await fetch(\`http://localhost:5000/api/todos/\${id}\`, {
    method: 'DELETE'
  });
  const data = await response.json();
  console.log(data.message); // 삭제 완료 메시지
}
\`\`\`

---

## 🏗️ 코드 구조 설명 (건축 비유)

### 1. **스키마 (Schema)** - `src/models/schemas/todoSchema.js`
**비유:** 건물의 상세 설계도

- 데이터의 구조를 정의합니다
- 어떤 정보를 저장할지 결정합니다
- 유효성 검사 규칙을 설정합니다
- 인덱스, 가상 필드, 메서드, 미들웨어 등을 정의합니다

### 2. **모델 (Model)** - `src/models/Todo.js`
**비유:** 설계도를 실제 건물로 변환하는 공정

- 스키마를 가져와서 Mongoose 모델로 변환합니다
- 데이터베이스와 실제로 통신할 수 있는 객체를 생성합니다

### 3. **컨트롤러 (Controller)** - `src/controllers/todoController.js`
**비유:** 건물의 관리자

- 실제 비즈니스 로직을 처리합니다
- 데이터베이스와 통신합니다
- 요청을 받아서 응답을 반환합니다

### 4. **라우터 (Router)** - `src/routers/todoRoutes.js`
**비유:** 건물의 안내판

- URL 경로를 정의합니다
- 각 경로를 적절한 컨트롤러와 연결합니다
- HTTP 메서드(GET, POST, PUT, DELETE)를 지정합니다

### 5. **메인 파일** - `index.js`
**비유:** 건물의 중앙 제어실

- 서버를 시작합니다
- 데이터베이스에 연결합니다
- 모든 미들웨어와 라우터를 연결합니다

---

## 📊 데이터 흐름

```
클라이언트 요청
    ↓
라우터 (경로 확인)
    ↓
컨트롤러 (로직 처리)
    ↓
모델 (데이터베이스 작업)
    ↓
    ├─ 스키마 (데이터 구조 & 유효성 검사)
    └─ MongoDB (데이터 저장/조회)
    ↓
컨트롤러 (결과 가공)
    ↓
클라이언트 응답
```

### 🏛️ 모델 계층 구조

```
schemas/todoSchema.js  →  Todo.js (모델)  →  Controller
   (스키마 정의)        (모델 변환)      (비즈니스 로직)
```

**분리의 장점:**
- ✅ **관심사 분리**: 스키마 정의와 모델 사용을 명확히 구분
- ✅ **재사용성**: 필요시 스키마를 다른 곳에서도 재사용 가능
- ✅ **유지보수**: 스키마 수정 시 해당 파일만 수정하면 됨
- ✅ **테스트**: 스키마와 모델을 독립적으로 테스트 가능
- ✅ **확장성**: 새로운 모델 추가 시 스키마 패턴 재사용 가능

---

## 🔍 데이터베이스 인덱스

성능 최적화를 위해 다음 인덱스가 자동으로 생성됩니다:

1. `createdAt: -1` - 생성일 기준 내림차순 정렬 최적화
2. `priority: 1, createdAt: -1` - 우선순위 필터링 및 정렬 복합 쿼리 최적화

**비유:** 도서관에서 책을 빠르게 찾기 위한 색인 카드

---

## 🎓 추가 기능 아이디어

현재 구현된 기능 외에 추가할 수 있는 기능들:

1. **사용자 인증** - 각 사용자마다 자신의 할일만 관리
2. **카테고리 기능** - 할일을 카테고리별로 분류
3. **반복 할일** - 매일, 매주 반복되는 할일 설정
4. **알림 기능** - 마감일이 다가오면 알림
5. **검색 기능** - 제목이나 설명으로 할일 검색
6. **첨부파일** - 할일에 파일 첨부
7. **공유 기능** - 다른 사용자와 할일 공유

---

## 🐛 문제 해결

### MongoDB 연결 실패
\`\`\`
❌ MongoDB 연결 실패: MongooseServerSelectionError
\`\`\`

**해결 방법:**
1. MongoDB가 실행 중인지 확인
2. `.env` 파일의 `MONGODB_URI`가 올바른지 확인
3. 로컬 MongoDB: `mongodb://localhost:27017/todo-app`
4. MongoDB Atlas: 연결 문자열에 username과 password 확인

### 포트 이미 사용 중
\`\`\`
Error: listen EADDRINUSE: address already in use :::5000
\`\`\`

**해결 방법:**
1. `.env` 파일에서 다른 포트 번호로 변경
2. 또는 기존 프로세스 종료

---

## 📚 참고 자료

- [Mongoose 공식 문서](https://mongoosejs.com/)
- [Express 공식 문서](https://expressjs.com/)
- [MongoDB 공식 문서](https://www.mongodb.com/docs/)
- [REST API 설계 가이드](https://restfulapi.net/)

---

**즐거운 코딩 되세요! 🚀**


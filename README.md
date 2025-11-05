# 📋 Todo Backend API

MongoDB와 Mongoose를 사용한 RESTful Todo 애플리케이션 백엔드 서버입니다.

## ✨ 주요 기능

- ✅ Todo 생성, 조회, 수정, 삭제 (CRUD)
- ✅ 우선순위 설정 (low, medium, high)
- ✅ 마감일 설정
- ✅ 태그 기능
- ✅ 통계 정보 제공 (전체 할일, 지연된 할일, 우선순위별 통계)

## 🚀 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 다음 내용을 추가하세요:

#### 방법 1: 완전한 URI 사용 (간단)

```env
PORT=5000
NODE_ENV=development
CORS_OPEN=true

# MongoDB 연결 (로컬)
MONGO_URI=mongodb://localhost:27017/todo-app

# 또는 MongoDB Atlas (클라우드)
MONGO_URI="mongodb+srv://아이디:비밀번호@cluster0.xxxxx.mongodb.net/todo-app"
```

#### 방법 2: 개별 환경변수 사용 (보안 강화, **Heroku 추천**)

```env
PORT=5000
NODE_ENV=production
CORS_OPEN=false

# MongoDB 인증 정보 (개별 관리)
MONGODB_USERNAME=GND
MONGODB_PASSWORD=dudwns9116!
MONGODB_CLUSTER=cluster0.h8vx0.mongodb.net
MONGODB_DATABASE=todo-app
```

**⚠️ 주의사항:**
- 비밀번호에 특수문자가 있으면 자동으로 URL 인코딩됩니다
- 방법 1과 방법 2 중 **하나만 선택**하면 됩니다
- Heroku 배포 시 방법 2가 더 안전합니다 (Git에 비밀번호가 노출되지 않음)

### 3. MongoDB 설치 및 실행

**로컬 MongoDB를 사용하는 경우:**
- [MongoDB 다운로드](https://www.mongodb.com/try/download/community)
- MongoDB 서비스 시작

**MongoDB Atlas (클라우드)를 사용하는 경우:**
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) 가입
- 클러스터 생성 후 연결 문자열 복사

### 4. 서버 실행

**개발 모드 (자동 재시작):**
```bash
npm run dev
```

**프로덕션 모드:**
```bash
npm start
```

서버가 정상 실행되면 다음과 같이 표시됩니다:
```
✅ MongoDB 연결성공
✅ 서버가 포트 5000에서 실행 중입니다.
🌐 http://localhost:5000
📋 Health Check: http://localhost:5000/health
```

## 📁 프로젝트 구조

```
todo-backend/
├── src/
│   ├── controllers/
│   │   └── todoController.js   # Todo 비즈니스 로직
│   ├── routers/
│   │   ├── index.js            # 라우터 통합
│   │   └── todoRoutes.js       # Todo API 라우터
│   ├── models/
│   │   ├── schemas/
│   │   │   └── todoSchema.js   # Todo 스키마 정의
│   │   ├── index.js            # 모델 통합
│   │   └── Todo.js             # Todo 모델 (스키마 → 모델 변환)
│   ├── middlewares/
│   │   └── corsConfig.js       # CORS 설정
│   ├── app.js                  # Express 앱 설정
│   └── index.js                # src 진입점
├── index.js                    # 서버 진입점 & DB 연결
├── test-all.js                 # 통합 테스트 (생성→조회→수정→삭제)
├── test-create-todo.js         # 할일 생성 테스트 스크립트
├── test-create-todo.http       # 할일 생성 REST Client 테스트
├── test-get-todos.js           # 할일 조회 테스트 스크립트
├── test-get-todos.http         # 할일 조회 REST Client 테스트
├── test-update-todo.js         # 할일 수정 테스트 스크립트
├── test-update-todo.http       # 할일 수정 REST Client 테스트
├── test-delete-todo.js         # 할일 삭제 테스트 스크립트
├── test-delete-todo.http       # 할일 삭제 REST Client 테스트
├── test-cors.html              # CORS 테스트 페이지
├── .env                        # 환경 변수 (직접 생성 필요)
├── .gitignore                  # Git 제외 파일
├── API_GUIDE.md                # 상세 API 가이드
├── CORS_GUIDE.md               # CORS 문제 해결 가이드
└── package.json                # 프로젝트 설정
```

## 📡 API 엔드포인트

### 기본 엔드포인트
- `GET /` - 서버 정보
- `GET /health` - 헬스 체크

### Todo API (`/api/todos`)
| Method | Endpoint | 설명 |
|--------|----------|------|
| `GET` | `/api/todos` | 모든 할일 조회 |
| `GET` | `/api/todos/:id` | 특정 할일 조회 |
| `POST` | `/api/todos` | 새 할일 생성 |
| `PUT` | `/api/todos/:id` | 할일 수정 |
| `DELETE` | `/api/todos/:id` | 할일 삭제 |
| `GET` | `/api/todos/stats` | 통계 정보 조회 |

> 📖 상세한 API 사용법은 [API_GUIDE.md](./API_GUIDE.md) 파일을 참고하세요.

## 🗄️ 데이터베이스 스키마

### Todo 모델

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `title` | String | ✅ | 할일 제목 (1~200자) |
| `description` | String | ❌ | 상세 설명 (최대 1000자) |
| `priority` | String | ❌ | 우선순위 (low/medium/high, 기본값: medium) |
| `dueDate` | Date | ❌ | 마감일 |
| `tags` | Array | ❌ | 태그 목록 |
| `createdAt` | Date | 자동 | 생성 일시 |
| `updatedAt` | Date | 자동 | 수정 일시 |

## 🛠️ 사용 기술

- **Node.js** - JavaScript 런타임
- **Express** - 웹 프레임워크
- **MongoDB** - NoSQL 데이터베이스
- **Mongoose** - MongoDB ODM
- **dotenv** - 환경 변수 관리
- **cors** - CORS 처리
- **morgan** - HTTP 로깅
- **nodemon** - 개발 시 자동 재시작

## 💡 빠른 테스트

### 🚀 통합 테스트 (생성→조회→수정→삭제)

```bash
# 전체 API 기능을 한 번에 테스트
node test-all.js
```

**특징:**
- ✅ 7단계 완전 자동화 테스트
- ✅ 생성 → 조회 → 필터링 → 정렬 → 수정 → 통계 → 삭제
- ✅ 색상으로 구분된 단계별 진행상황
- ✅ 테스트 후 자동 정리 (생성한 데이터 삭제)

---

### 🎯 할일 생성 테스트

#### 방법 1: 자동 테스트 스크립트 (추천)
```bash
# 서버가 실행 중인 상태에서 새 터미널 열고:
node test-create-todo.js
```

**특징:**
- ✅ 8가지 테스트 케이스 자동 실행
- ✅ 색상으로 구분된 결과 표시
- ✅ 성공/실패 자동 판단
- ✅ 유효성 검사 테스트 포함

#### 방법 2: REST Client (VS Code)
VS Code에서 `test-create-todo.http` 파일을 열고 "Send Request" 클릭

#### 방법 3: cURL
```bash
curl -X POST http://localhost:5000/api/todos \
  -H "Content-Type: application/json" \
  -d '{"title":"첫 번째 할일","priority":"high"}'
```

---

### 🔍 할일 조회 테스트

#### 방법 1: 자동 테스트 스크립트 (추천)
```bash
# 서버가 실행 중인 상태에서 새 터미널 열고:
node test-get-todos.js
```

**특징:**
- ✅ 8가지 조회 테스트 자동 실행
- ✅ 우선순위별 필터링 테스트
- ✅ 정렬 기능 테스트
- ✅ 상세 정보 & 통계 조회
- ✅ 색상과 이모지로 구분된 결과

#### 방법 2: REST Client (VS Code)
VS Code에서 `test-get-todos.http` 파일을 열고 "Send Request" 클릭

#### 방법 3: cURL
```bash
# 모든 할일 조회
curl http://localhost:5000/api/todos

# 높은 우선순위만 조회
curl http://localhost:5000/api/todos?priority=high

# 통계 정보 조회
curl http://localhost:5000/api/todos/stats
```

---

### ✏️  할일 수정 테스트

#### 방법 1: 자동 테스트 스크립트 (추천)
```bash
# 서버가 실행 중인 상태에서 새 터미널 열고:
node test-update-todo.js
```

**특징:**
- ✅ 9가지 수정 테스트 자동 실행
- ✅ 단일 필드 수정 (제목, 우선순위, 설명, 마감일, 태그)
- ✅ 다중 필드 동시 수정
- ✅ 수정 전/후 비교 표시
- ✅ 유효성 검사 테스트
- ✅ 테스트 후 자동 정리

#### 방법 2: REST Client (VS Code)
VS Code에서 `test-update-todo.http` 파일을 열고 "Send Request" 클릭

#### 방법 3: cURL
```bash
# 먼저 할일 ID 조회
curl http://localhost:5000/api/todos

# 제목 수정
curl -X PUT http://localhost:5000/api/todos/{id} \
  -H "Content-Type: application/json" \
  -d '{"title":"수정된 제목"}'

# 우선순위 수정
curl -X PUT http://localhost:5000/api/todos/{id} \
  -H "Content-Type: application/json" \
  -d '{"priority":"high"}'
```

---

### 🗑️  할일 삭제 테스트

#### 방법 1: 자동 테스트 스크립트 (추천)
```bash
# 서버가 실행 중인 상태에서 새 터미널 열고:
node test-delete-todo.js
```

**특징:**
- ✅ 7가지 삭제 테스트 자동 실행
- ✅ 단일 삭제 및 연속 삭제
- ✅ 삭제 확인 (404 체크)
- ✅ 잘못된 ID 처리 테스트
- ✅ 삭제 전후 통계 비교
- ✅ 테스트 데이터 자동 생성 및 정리

#### 방법 2: REST Client (VS Code)
VS Code에서 `test-delete-todo.http` 파일을 열고 "Send Request" 클릭

#### 방법 3: cURL
```bash
# 먼저 할일 ID 조회
curl http://localhost:5000/api/todos

# 특정 할일 삭제
curl -X DELETE http://localhost:5000/api/todos/{id}

# 삭제 확인 (404가 나와야 정상)
curl http://localhost:5000/api/todos/{id}
```

## 🚀 Heroku 배포

### 1. Heroku 환경변수 설정

Heroku 대시보드(https://dashboard.heroku.com)에서:

**Settings** → **Config Vars** → **Reveal Config Vars**

#### 방법 1: 완전한 URI 사용
| KEY | VALUE |
|-----|-------|
| `MONGO_URI` | `mongodb+srv://아이디:비밀번호@cluster0.xxxxx.mongodb.net/todo-app` |
| `NODE_ENV` | `production` |

#### 방법 2: 개별 환경변수 사용 (추천)
| KEY | VALUE |
|-----|-------|
| `MONGODB_USERNAME` | `GND` |
| `MONGODB_PASSWORD` | `dudwns9116!` |
| `MONGODB_CLUSTER` | `cluster0.h8vx0.mongodb.net` |
| `MONGODB_DATABASE` | `todo-app` |
| `NODE_ENV` | `production` |
| `CORS_OPEN` | `false` |

**⚠️ 중요:**
- 방법 2가 더 안전합니다 (각 환경변수가 분리되어 관리됨)
- 특수문자는 자동으로 URL 인코딩됩니다
- `CORS_OPEN`은 production에서 반드시 `false`로 설정

### 2. GitHub 연동 및 배포

```bash
# GitHub에 푸시 (Heroku가 자동 배포)
git push origin main
```

또는 Heroku CLI 사용:

```bash
# Heroku에 직접 푸시
git push heroku main
```

### 3. 배포 확인

```bash
# 앱 URL 확인
heroku open

# 로그 확인
heroku logs --tail
```

### 4. 문제 발생 시

**503 Service Unavailable 에러:**
- Config Vars가 올바르게 설정되었는지 확인
- 로그에서 MongoDB 연결 상태 확인
- `heroku logs --tail`로 실시간 로그 확인

**MongoDB 연결 실패:**
- MongoDB Atlas에서 IP Whitelist 확인 (0.0.0.0/0 허용 필요)
- 아이디/비밀번호가 정확한지 확인
- 클러스터 주소가 올바른지 확인

## 🔒 CORS 문제 해결

프론트엔드에서 API 호출 시 CORS 오류가 발생하나요?

### 빠른 해결:

`.env` 파일에 추가:
```env
# 프론트엔드 URL
FRONTEND_URL=http://localhost:3000

# 또는 개발 중 모든 오리진 허용 (개발 전용!)
CORS_OPEN=true
```

서버 재시작:
```bash
npm run dev
```

### CORS 테스트:

브라우저에서 `test-cors.html` 파일을 열어서 CORS 설정을 테스트할 수 있습니다.

📖 자세한 내용: [CORS_GUIDE.md](./CORS_GUIDE.md)

---

## 📚 참고 문서

- [API_GUIDE.md](./API_GUIDE.md) - 전체 API 사용 가이드
- [CORS_GUIDE.md](./CORS_GUIDE.md) - CORS 문제 해결 가이드
- [Mongoose 공식 문서](https://mongoosejs.com/)
- [Express 공식 문서](https://expressjs.com/)

## 🎯 향후 개선 사항

- [ ] 사용자 인증 (JWT)
- [ ] 데이터 유효성 검사 강화
- [ ] 페이지네이션
- [ ] 검색 기능
- [ ] 파일 첨부
- [ ] 실시간 알림


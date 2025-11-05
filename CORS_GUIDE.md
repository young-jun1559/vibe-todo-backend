# 🔒 CORS 문제 해결 가이드

## 📌 CORS란?

**CORS (Cross-Origin Resource Sharing)**는 브라우저 보안 기능입니다.

### 간단히 말하면:
```
프론트엔드 (http://localhost:3000)
    ↓ API 요청
백엔드 (http://localhost:5000)
    ↓ 
❌ 차단! "다른 도메인이라 안돼!"
```

### 해결 방법:
백엔드에서 "이 프론트엔드는 허용!" 설정 필요

---

## ✅ 이미 적용된 해결책

### 1️⃣ **상세한 CORS 설정**

`src/middlewares/corsConfig.js` 파일이 생성되었습니다:

- ✅ 여러 프론트엔드 포트 허용
- ✅ Credentials (쿠키) 지원
- ✅ Preflight 요청 처리
- ✅ 개발/프로덕션 환경 분리

### 2️⃣ **허용되는 오리진**

기본적으로 다음 포트가 허용됩니다:
- `http://localhost:3000` - React 기본 포트
- `http://localhost:3001` - React 추가 포트
- `http://localhost:4200` - Angular
- `http://localhost:8080` - Vue
- `http://localhost:5173` - Vite
- `http://127.0.0.1:3000`
- `http://127.0.0.1:5173`

---

## 🚀 빠른 해결 방법

### **방법 1: .env 파일 설정 (추천)**

`.env` 파일에 프론트엔드 URL 추가:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/todo-app
NODE_ENV=development

# 프론트엔드 URL 추가
FRONTEND_URL=http://localhost:3000
```

### **방법 2: 개발 중 모든 오리진 허용**

`.env` 파일에 추가:

```env
# ⚠️ 개발 전용! 프로덕션에서는 절대 사용 금지
CORS_OPEN=true
```

### **방법 3: 커스텀 포트 추가**

`src/middlewares/corsConfig.js` 파일에서 `allowedOrigins` 배열에 추가:

```javascript
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:8888',      // ← 여기에 추가
  // ... 기타
];
```

---

## 🔍 CORS 오류 확인 방법

### 브라우저 콘솔에서 확인:

#### ❌ CORS 오류 메시지 예시:
```
Access to fetch at 'http://localhost:5000/api/todos' 
from origin 'http://localhost:3000' has been blocked by CORS policy: 
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

#### ❌ Preflight 오류:
```
Access to fetch at 'http://localhost:5000/api/todos' 
from origin 'http://localhost:3000' has been blocked by CORS policy: 
Response to preflight request doesn't pass access control check.
```

---

## 🛠️ 단계별 해결 가이드

### 1단계: 서버 재시작

CORS 설정을 변경했다면 **반드시 서버 재시작**:

```bash
# 서버 중지 (Ctrl + C)
# 다시 시작
npm run dev
```

### 2단계: 프론트엔드 URL 확인

프론트엔드가 실행 중인 정확한 URL 확인:

```bash
# React 예시
Local:            http://localhost:3000
On Your Network:  http://192.168.0.100:3000
```

→ `http://localhost:3000` 사용

### 3단계: 백엔드 로그 확인

서버 실행 시 CORS 체크 로그 확인:

```bash
🔍 CORS 체크 - 요청 오리진: http://localhost:3000
```

허용되지 않은 오리진이면:
```bash
⚠️  허용되지 않은 오리진: http://localhost:8888
💡 .env 파일에 FRONTEND_URL을 추가하거나
💡 corsConfig.js의 allowedOrigins에 추가하세요
```

---

## 🧪 테스트 방법

### 1. 브라우저에서 직접 테스트

```javascript
// 브라우저 콘솔에서 실행
fetch('http://localhost:5000/api/todos')
  .then(res => res.json())
  .then(data => console.log('✅ 성공:', data))
  .catch(err => console.error('❌ 실패:', err));
```

### 2. React에서 테스트

```javascript
// src/App.js
useEffect(() => {
  fetch('http://localhost:5000/api/todos')
    .then(res => res.json())
    .then(data => {
      console.log('✅ API 연결 성공:', data);
    })
    .catch(err => {
      console.error('❌ API 연결 실패:', err);
    });
}, []);
```

### 3. Axios 사용 시

```javascript
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:5000';
axios.defaults.withCredentials = true;  // credentials 사용 시

axios.get('/api/todos')
  .then(res => console.log('✅ 성공:', res.data))
  .catch(err => console.error('❌ 실패:', err));
```

---

## 🎯 프로덕션 배포 시

### 1. 프로덕션 URL 추가

`src/middlewares/corsConfig.js`에서:

```javascript
const allowedOrigins = [
  // 개발 환경
  'http://localhost:3000',
  'http://localhost:5173',
  
  // 프로덕션 환경 추가
  'https://your-app.com',
  'https://www.your-app.com',
  
  process.env.FRONTEND_URL
].filter(Boolean);
```

### 2. .env 파일 설정

프로덕션 서버의 `.env`:

```env
NODE_ENV=production
FRONTEND_URL=https://your-app.com
# CORS_OPEN=true  ← 절대 사용 금지!
```

### 3. 환경별 분리 (선택사항)

```javascript
// corsConfig.js
const corsOptions = {
  origin: function (origin, callback) {
    const isDevelopment = process.env.NODE_ENV === 'development';
    const isProduction = process.env.NODE_ENV === 'production';
    
    if (isDevelopment) {
      // 개발 환경: 모든 localhost 허용
      if (!origin || origin.includes('localhost') || origin.includes('127.0.0.1')) {
        return callback(null, true);
      }
    }
    
    if (isProduction) {
      // 프로덕션: 명시적인 도메인만 허용
      const allowedOrigins = [
        'https://your-app.com',
        'https://www.your-app.com'
      ];
      
      if (allowedOrigins.indexOf(origin) !== -1) {
        return callback(null, true);
      }
    }
    
    callback(new Error('CORS 차단'));
  },
  // ... 기타 설정
};
```

---

## 🔧 고급 설정

### Credentials (인증 쿠키) 사용

백엔드에서 이미 설정됨:
```javascript
credentials: true
```

프론트엔드에서도 설정 필요:

```javascript
// Fetch API
fetch('http://localhost:5000/api/todos', {
  credentials: 'include'
});

// Axios
axios.defaults.withCredentials = true;
```

### 커스텀 헤더 추가

`corsConfig.js`에서:

```javascript
allowedHeaders: [
  'Content-Type',
  'Authorization',
  'X-Custom-Header',      // ← 커스텀 헤더 추가
  'X-API-Key'
],
```

---

## 🐛 문제 해결 체크리스트

- [ ] 서버를 재시작했나요?
- [ ] 프론트엔드 URL이 정확한가요? (포트 번호 확인)
- [ ] `.env` 파일에 `FRONTEND_URL` 설정했나요?
- [ ] `http://` 또는 `https://` 프로토콜이 정확한가요?
- [ ] 브라우저 캐시를 지웠나요? (Ctrl + Shift + R)
- [ ] 개발자 도구의 Network 탭에서 요청 헤더를 확인했나요?
- [ ] OPTIONS 요청(preflight)이 실패하지 않았나요?

---

## 📞 여전히 문제가 있다면?

### 디버그 모드 활성화

서버 로그에서 상세 정보 확인:

```javascript
// corsConfig.js에서 이미 설정됨
if (process.env.NODE_ENV === 'development') {
  console.log('🔍 CORS 체크 - 요청 오리진:', origin);
}
```

### 브라우저 개발자 도구 확인

1. **Network 탭** 열기 (F12)
2. API 요청 클릭
3. **Headers** 탭 확인:
   - Request Headers의 `Origin`
   - Response Headers의 `Access-Control-Allow-Origin`

### 임시 우회 (테스트용)

`.env`에 추가:
```env
CORS_OPEN=true
```

이렇게 하면 모든 오리진 허용 (개발 전용!)

---

## 📚 참고 자료

- [MDN - CORS](https://developer.mozilla.org/ko/docs/Web/HTTP/CORS)
- [Express CORS 미들웨어](https://expressjs.com/en/resources/middleware/cors.html)
- [Same-Origin Policy 설명](https://developer.mozilla.org/ko/docs/Web/Security/Same-origin_policy)

---

## ✅ 요약

1. **개발 환경**: `.env`에 `CORS_OPEN=true` 추가 (가장 쉬운 방법)
2. **특정 포트**: `corsConfig.js`의 `allowedOrigins`에 추가
3. **프로덕션**: 실제 도메인을 `allowedOrigins`에 추가
4. **문제 발생**: 서버 재시작 + 브라우저 캐시 삭제

CORS는 보안을 위한 기능입니다. 개발 시에는 편의를 위해 느슨하게 설정하되, 
프로덕션에서는 반드시 필요한 오리진만 허용하세요! 🔒


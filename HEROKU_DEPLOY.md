# 🚀 Heroku 배포 가이드

이 문서는 `todo-backend`를 Heroku에 배포하는 방법을 단계별로 안내합니다.

---

## 📋 사전 준비

### 1. Heroku CLI 설치
Windows PowerShell에서 실행:
```powershell
# Chocolatey로 설치 (권장)
choco install heroku-cli

# 또는 공식 인스톨러 다운로드
# https://devcenter.heroku.com/articles/heroku-cli
```

### 2. Heroku 로그인
```bash
heroku login
```
브라우저가 열리면 Heroku 계정으로 로그인하세요.

---

## 🏗️ 배포 단계

### Step 1: Heroku 앱 생성
```bash
# 앱 이름은 자동 생성
heroku create

# 또는 원하는 이름으로 생성 (예: vibe-todo-backend)
heroku create vibe-todo-backend
```

**결과 예시:**
```
Creating app... done, ⬢ vibe-todo-backend
https://vibe-todo-backend.herokuapp.com/ | https://git.heroku.com/vibe-todo-backend.git
```

### Step 2: MongoDB 환경 변수 설정
**중요!** MongoDB Atlas 연결 정보를 Heroku에 설정해야 합니다.

```bash
# MongoDB URI 설정
heroku config:set MONGO_URI="mongodb+srv://aaa1:iegRNxHq6UpT67P8@cluster0.h8vx0.mongodb.net/todo-app"

# 또는 개별 환경 변수로 설정
heroku config:set MONGODB_USERNAME=aaa1
heroku config:set MONGODB_PASSWORD=iegRNxHq6UpT67P8
heroku config:set MONGODB_CLUSTER=cluster0.h8vx0.mongodb.net
heroku config:set MONGODB_DATABASE=todo-app
```

### Step 3: 기타 환경 변수 설정
```bash
# Node 환경
heroku config:set NODE_ENV=production

# CORS 설정
heroku config:set CORS_OPEN=true

# 포트는 Heroku가 자동으로 설정하므로 설정하지 않아도 됩니다
```

### Step 4: 환경 변수 확인
```bash
heroku config
```

**예상 출력:**
```
=== vibe-todo-backend Config Vars
MONGO_URI:     mongodb+srv://aaa1:***@cluster0.h8vx0.mongodb.net/todo-app
NODE_ENV:      production
CORS_OPEN:     true
```

### Step 5: Git Remote 확인
```bash
git remote -v
```

**예상 출력:**
```
heroku  https://git.heroku.com/vibe-todo-backend.git (fetch)
heroku  https://git.heroku.com/vibe-todo-backend.git (push)
origin  https://github.com/young-jun1559/vibe-todo-backend.git (fetch)
origin  https://github.com/young-jun1559/vibe-todo-backend.git (push)
```

만약 heroku remote가 없다면:
```bash
heroku git:remote -a vibe-todo-backend
```

### Step 6: 배포 실행
```bash
git push heroku main
```

**배포 과정:**
```
Counting objects: 100%...
Compressing objects: 100%...
Writing objects: 100%...
remote: Compressing source files... done.
remote: Building source:
remote: -----> Building on the Heroku-22 stack
remote: -----> Using buildpack: heroku/nodejs
remote: -----> Node.js app detected
remote: -----> Installing node modules
remote: -----> Discovering process types
remote:        Procfile declares types -> web
remote: -----> Launching...
remote:        Released v1
remote:        https://vibe-todo-backend.herokuapp.com/ deployed to Heroku
```

### Step 7: 로그 확인
```bash
# 실시간 로그 확인
heroku logs --tail

# 최근 로그만 확인
heroku logs --tail -n 200
```

### Step 8: 앱 열기
```bash
heroku open
```

또는 브라우저에서 직접 접속:
```
https://your-app-name.herokuapp.com
```

---

## 🧪 배포 후 테스트

### 1. 기본 엔드포인트 테스트
```bash
curl https://your-app-name.herokuapp.com/
```

**예상 응답:**
```json
{
  "message": "Todo Backend API Server",
  "version": "1.0.0",
  "status": "running",
  "database": "connected"
}
```

### 2. Health Check
```bash
curl https://your-app-name.herokuapp.com/health
```

### 3. MongoDB 연결 테스트
```bash
curl https://your-app-name.herokuapp.com/api/test/connection
```

### 4. 전체 CRUD 테스트
```bash
curl https://your-app-name.herokuapp.com/api/test/full
```

### 5. 테스트 페이지 접속
브라우저에서:
```
https://your-app-name.herokuapp.com/test
```

---

## 🔧 유용한 Heroku 명령어

### 앱 정보 확인
```bash
heroku info
```

### 앱 재시작
```bash
heroku restart
```

### 데이터베이스 연결 테스트
```bash
heroku run node -e "console.log(process.env.MONGO_URI)"
```

### 환경 변수 추가/수정
```bash
heroku config:set KEY=VALUE
```

### 환경 변수 삭제
```bash
heroku config:unset KEY
```

### 앱 스케일 조정 (무료 플랜)
```bash
heroku ps:scale web=1
```

### 앱 중지
```bash
heroku ps:scale web=0
```

### Heroku 대시보드 열기
```bash
heroku dashboard
```

---

## 🔐 MongoDB Atlas 화이트리스트 설정

Heroku에서 MongoDB Atlas에 접속하려면 IP 화이트리스트를 설정해야 합니다.

### 방법 1: 모든 IP 허용 (개발/테스트용)
1. MongoDB Atlas 대시보드 로그인
2. Network Access 메뉴 클릭
3. "Add IP Address" 클릭
4. "Allow Access from Anywhere" 선택
5. IP: `0.0.0.0/0` 추가
6. Confirm 클릭

### 방법 2: Heroku IP만 허용 (권장)
Heroku는 동적 IP를 사용하므로 "Allow Access from Anywhere"를 사용하거나,
MongoDB Atlas의 Private Endpoint를 사용해야 합니다.

---

## 📁 필수 파일 체크리스트

배포 전에 다음 파일들이 있는지 확인하세요:

- ✅ `package.json` - 의존성 및 스크립트 정의
- ✅ `Procfile` - Heroku 프로세스 정의 (`web: node index.js`)
- ✅ `.gitignore` - `.env` 파일 제외
- ✅ `index.js` - 메인 서버 파일
- ✅ `README.md` - 프로젝트 설명

---

## 🏗️ 건축 비유로 이해하기

### Heroku 배포 과정

1. **`package.json`** = 건물 설계 도면
   - 필요한 자재(dependencies) 목록
   - 건축 방법(scripts) 정의

2. **`Procfile`** = 공사 시작 명령서
   - Heroku에게 어떻게 앱을 실행할지 알려줌

3. **환경 변수** = 비밀 열쇠와 보안 코드
   - MongoDB 비밀번호 등 민감한 정보
   - 코드에 직접 쓰지 않고 별도로 관리

4. **Git Push** = 건축 자재 운송
   - 코드를 Heroku 서버로 전송

5. **Heroku Build** = 실제 건축 작업
   - 의존성 설치, 앱 빌드

6. **Deploy** = 건물 오픈
   - 앱이 실제로 인터넷에 공개됨

---

## ⚠️ 주의사항

### 1. 환경 변수 보안
- ❌ `.env` 파일을 Git에 절대 커밋하지 마세요
- ✅ Heroku Config Vars에만 설정하세요

### 2. MongoDB Atlas 설정
- ✅ Network Access에서 IP 화이트리스트 설정
- ✅ Database User가 올바르게 생성되었는지 확인

### 3. 무료 플랜 제한
- Heroku 무료 플랜: 월 550-1000 dyno hours
- 30분 비활성 시 자동으로 슬립 모드
- 첫 요청 시 깨어나는데 몇 초 소요

### 4. Node 버전
- `package.json`의 `engines` 필드 확인
- Heroku가 지원하는 Node.js 버전 사용

---

## 🐛 문제 해결

### 배포 실패 시
```bash
# 로그 확인
heroku logs --tail

# 빌드 로그 확인
heroku builds:info
```

### MongoDB 연결 실패 시
```bash
# 환경 변수 확인
heroku config

# MongoDB URI 재설정
heroku config:set MONGO_URI="your-mongodb-uri"
```

### 앱이 시작되지 않을 때
```bash
# Procfile 확인
cat Procfile

# 로컬에서 Heroku처럼 실행
heroku local web
```

---

## 📊 배포 체크리스트

배포 전 최종 확인:

- [ ] `.env` 파일이 `.gitignore`에 포함됨
- [ ] `package.json`에 모든 의존성이 있음
- [ ] `Procfile`이 올바르게 작성됨
- [ ] MongoDB Atlas IP 화이트리스트 설정
- [ ] Heroku Config Vars 설정 완료
- [ ] 로컬에서 정상 작동 확인
- [ ] Git에 모든 변경사항 커밋

---

## 🔄 업데이트 배포

코드를 수정한 후 다시 배포:

```bash
# 1. 변경사항 커밋
git add .
git commit -m "업데이트 내용"

# 2. GitHub에 푸시 (선택)
git push origin main

# 3. Heroku에 배포
git push heroku main

# 4. 로그 확인
heroku logs --tail
```

---

## 📚 추가 자료

- [Heroku Node.js 공식 문서](https://devcenter.heroku.com/articles/deploying-nodejs)
- [MongoDB Atlas 연결 가이드](https://www.mongodb.com/docs/atlas/driver-connection/)
- [Heroku Config Vars](https://devcenter.heroku.com/articles/config-vars)

---

## ✅ 배포 완료!

모든 단계를 완료하면 앱이 다음 주소에서 실행됩니다:
```
https://your-app-name.herokuapp.com
```

테스트 페이지:
```
https://your-app-name.herokuapp.com/test
```

축하합니다! 🎉


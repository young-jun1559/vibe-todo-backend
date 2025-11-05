/**
 * CORS 설정 미들웨어
 * 
 * 건축 비유: 건물의 출입 보안 시스템
 * 어떤 방문자(오리진)를 허용할지 결정합니다.
 */

/**
 * CORS 옵션 설정
 * 
 * Cross-Origin Resource Sharing (CORS)는 브라우저 보안 기능입니다.
 * 다른 도메인에서 우리 API를 호출할 수 있도록 허용 설정이 필요합니다.
 */
const corsOptions = {
  /**
   * origin: 요청을 허용할 출처
   * 
   * 건축 비유: 허가된 방문자 명단
   * - 명단에 있으면 입장 허가
   * - 없으면 차단
   */
  origin: function (origin, callback) {
    // 개발 환경에서 허용할 오리진 목록
    const allowedOrigins = [
      'http://localhost:3000',      // React 개발 서버 (기본)
      'http://localhost:3001',      // React 추가 포트
      'http://localhost:4200',      // Angular
      'http://localhost:8080',      // Vue
      'http://localhost:5173',      // Vite
      'http://localhost:5174',      // Vite 추가 포트
      'http://localhost:5500',      // VS Code Live Server
      'http://127.0.0.1:3000',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:5000',      // 로컬 백엔드
      'http://127.0.0.1:5500',      // VS Code Live Server (127.0.0.1)
      'null',                        // 로컬 파일 (file://)
      process.env.FRONTEND_URL,     // .env에서 설정한 프론트엔드 URL
      // 프로덕션 URL 추가 예시:
      // 'https://your-frontend-domain.com',
      // 'https://www.your-frontend-domain.com'
    ].filter(Boolean);                // undefined 제거

    // 디버그 로그 (개발 환경에서만)
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 CORS 체크 - 요청 오리진:', origin);
    }

    // 오리진이 없는 경우 (모바일 앱, Postman, curl 등)
    if (!origin) {
      return callback(null, true);
    }

    // 허용된 오리진 확인
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      // 개발 환경에서는 경고만 표시하고 허용
      if (process.env.NODE_ENV === 'development') {
        console.warn('⚠️  허용되지 않은 오리진:', origin);
        console.warn('💡 .env 파일에 FRONTEND_URL을 추가하거나');
        console.warn('💡 corsConfig.js의 allowedOrigins에 추가하세요');
        callback(null, true);  // 개발 환경에서는 모두 허용
      } else {
        // 프로덕션 환경에서는 차단
        callback(new Error(`CORS 정책에 의해 차단되었습니다: ${origin}`));
      }
    }
  },

  /**
   * credentials: 쿠키 전송 허용
   * 
   * true로 설정하면 브라우저가 쿠키, 인증 헤더 등을 함께 전송합니다.
   * 인증이 필요한 API에서 필수입니다.
   */
  credentials: true,

  /**
   * methods: 허용할 HTTP 메서드
   */
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'],

  /**
   * allowedHeaders: 허용할 요청 헤더
   * 
   * 클라이언트가 보낼 수 있는 헤더 목록
   */
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'X-HTTP-Method-Override',
    'Accept',
    'Origin'
  ],

  /**
   * exposedHeaders: 브라우저에 노출할 응답 헤더
   * 
   * 기본적으로 브라우저는 일부 헤더만 접근 가능합니다.
   * 추가 헤더에 접근하려면 여기에 명시해야 합니다.
   */
  exposedHeaders: [
    'Content-Length',
    'Content-Range',
    'X-Content-Range',
    'X-Total-Count'
  ],

  /**
   * optionsSuccessStatus: OPTIONS 요청 응답 코드
   * 
   * 일부 구형 브라우저(IE11)는 204를 제대로 처리하지 못합니다.
   * 200으로 설정하면 호환성이 향상됩니다.
   */
  optionsSuccessStatus: 200,

  /**
   * maxAge: preflight 요청 캐시 시간 (초)
   * 
   * 브라우저가 preflight 요청 결과를 캐시하는 시간
   * 86400초 = 24시간
   * 
   * preflight 요청이란?
   * - OPTIONS 메서드로 먼저 확인 요청을 보내는 것
   * - 실제 요청 전에 허용 여부를 체크
   */
  maxAge: 86400,

  /**
   * preflightContinue: preflight 요청을 다음 핸들러로 전달
   * 
   * false: CORS 미들웨어에서 preflight 응답 완료
   * true: 다음 미들웨어로 전달
   */
  preflightContinue: false
};

/**
 * 개발 환경용 - 모든 오리진 허용
 * 
 * 주의: 프로덕션에서는 절대 사용하지 마세요!
 */
const corsOptionsForDevelopment = {
  origin: true,                    // 모든 오리진 허용
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
};

/**
 * 환경에 따라 적절한 CORS 옵션 선택
 */
const getCorsOptions = () => {
  // 환경 변수로 CORS를 완전히 개방할지 결정
  if (process.env.CORS_OPEN === 'true') {
    console.log('⚠️  모든 오리진 허용 모드 (개발 전용)');
    return corsOptionsForDevelopment;
  }
  
  return corsOptions;
};

module.exports = {
  corsOptions,
  corsOptionsForDevelopment,
  getCorsOptions
};


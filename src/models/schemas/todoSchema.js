const mongoose = require('mongoose');

/**
 * Todo 스키마 정의
 * 
 * 건축 비유: 집을 짓기 전 설계도를 그리는 것과 같습니다.
 * 어떤 방(필드)이 필요하고, 각 방의 용도(타입)와 규칙(유효성 검사)을 정의합니다.
 * 
 * 이 파일은 순수한 스키마 정의만을 담당합니다.
 */
const todoSchema = new mongoose.Schema(
  {
    // 할일 제목 - 필수 입력 항목
    title: {
      type: String,
      required: [true, '할일 제목은 필수입니다'],
      trim: true, // 앞뒤 공백 자동 제거
      minlength: [1, '제목은 최소 1자 이상이어야 합니다'],
      maxlength: [200, '제목은 200자를 초과할 수 없습니다']
    },
    
    // 할일 상세 설명 - 선택 항목
    description: {
      type: String,
      trim: true,
      maxlength: [1000, '설명은 1000자를 초과할 수 없습니다'],
      default: '' // 기본값: 빈 문자열
    },
    
    // 우선순위 (선택 항목)
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'], // 허용되는 값만 저장 가능
      default: 'medium'
    },
    
    // 마감일 (선택 항목)
    dueDate: {
      type: Date,
      default: null
    },
    
    // 태그 (선택 항목) - 배열로 여러 태그 저장 가능
    tags: {
      type: [String],
      default: []
    }
  },
  {
    // timestamps 옵션: createdAt, updatedAt 필드를 자동으로 생성 및 관리
    // 건축 비유: 건물의 준공일과 리모델링 날짜를 자동으로 기록하는 것
    timestamps: true,
    
    // 가상 필드(virtual)나 메서드를 JSON으로 변환할 때 포함
    toJSON: {
      virtuals: true,
      transform: function(doc, ret) {
        // MongoDB의 _id를 id로도 사용 가능하게 하고, __v(버전 키) 제거
        ret.id = ret._id;
        delete ret.__v;
        return ret;
      }
    },
    toObject: {
      virtuals: true
    }
  }
);

/**
 * 인덱스 생성
 * 
 * 건축 비유: 건물에 엘리베이터나 비상계단을 설치하는 것과 같습니다.
 * 데이터를 더 빠르게 찾을 수 있도록 도와줍니다.
 */
// 생성일 기준 내림차순 정렬을 위한 인덱스
todoSchema.index({ createdAt: -1 });

// 우선순위로 필터링 최적화
todoSchema.index({ priority: 1, createdAt: -1 });

/**
 * 가상 필드 (Virtual Field)
 * 
 * 건축 비유: 실제로는 존재하지 않지만, 필요할 때 계산해서 보여주는 정보
 * 예: 방의 실제 크기는 저장하지 않지만, 가로x세로로 계산해서 보여주는 것
 */
todoSchema.virtual('isOverdue').get(function() {
  // 마감일이 있고, 마감일이 지났는지 확인
  if (this.dueDate) {
    return new Date() > this.dueDate;
  }
  return false;
});

/**
 * 인스턴스 메서드
 * 
 * 건축 비유: 각 방(데이터)에서 사용할 수 있는 기능들
 * 예: 불 켜기/끄기, 문 열기/닫기 등
 */

// 우선순위 변경
todoSchema.methods.setPriority = function(priority) {
  this.priority = priority;
  return this.save();
};

/**
 * 정적 메서드 (Static Methods)
 * 
 * 건축 비유: 건물 전체를 관리하는 기능들
 * 예: 모든 방 청소하기, 특정 층의 방 찾기 등
 */

// 특정 우선순위의 할일 가져오기
todoSchema.statics.findByPriority = function(priority) {
  return this.find({ priority }).sort({ createdAt: -1 });
};

// 마감일이 지난 할일 가져오기
todoSchema.statics.findOverdue = function() {
  return this.find({
    dueDate: { $lt: new Date(), $ne: null }
  }).sort({ dueDate: 1 });
};

/**
 * 미들웨어 (Middleware/Hooks)
 * 
 * 건축 비유: 자동 감지 시스템
 * 예: 사람이 들어오면 자동으로 불이 켜지는 센서
 */

// 저장 전 실행되는 미들웨어
todoSchema.pre('save', function(next) {
  if (this.isNew) {
    console.log(`✨ 새 할일 생성: ${this.title}`);
  }
  next();
});

// 삭제 전 실행되는 미들웨어
todoSchema.pre('deleteOne', { document: true }, function(next) {
  console.log(`🗑️  할일 삭제: ${this.title}`);
  next();
});

module.exports = todoSchema;


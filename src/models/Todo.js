const mongoose = require('mongoose');
const todoSchema = require('./schemas/todoSchema');

/**
 * Todo 모델
 *
 * 건축 비유: 설계도(스키마)를 바탕으로 실제 건물을 짓는 것
 *
 * 이 파일은 스키마를 가져와서 모델을 생성하는 역할만 합니다.
 * 모든 스키마 정의는 schemas/todoSchema.js 파일에 있습니다.
 *
 * 컬렉션 이름: 'good' (세 번째 파라미터로 명시적 지정)
 */
const Todo = mongoose.model('Todo', todoSchema, 'good');

module.exports = Todo;

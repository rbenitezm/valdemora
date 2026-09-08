import { test } from 'node:test';
import assert from 'node:assert/strict';
import { advance, initialState, restore, questions } from './case.ts';

void test('first investigation requires evidence, deduction and all questions', () => {
  assert.equal(advance(initialState, { type: 'deduce' }).deduction, false);
  assert.deepEqual(advance(initialState, { type: 'answer', id: 'sound' }).answers, []);
  let state = advance(initialState, { type: 'discover' });
  state = advance(state, { type: 'discover' });
  assert.deepEqual(state.found, [4]);
  state = advance(state, { type: 'deduce' });
  state = advance(state, { type: 'answer', id: 'sound' });
  assert.equal(advance(state, { type: 'testimony' }).testimony, false);
  for (const q of questions) state = advance(state, { type: 'answer', id: q.id });
  assert.equal(state.answers.length, 3);
  state = advance(state, { type: 'testimony' });
  assert.equal(state.testimony, true);
  assert.deepEqual(restore(JSON.stringify(state)), state);
});
void test('damaged and inconsistent saves cannot bypass progression', () => {
  for (const raw of [null, 'oops', '{}', '{"version":2}', 'null']) assert.deepEqual(restore(raw), initialState);
  assert.deepEqual(restore(JSON.stringify({version:1, found:[], deduction:true, answers:['sound','sight','photo'], testimony:true})), initialState);
  assert.equal(restore(JSON.stringify({version:1, found:[4], deduction:true, answers:['sound','unknown'], testimony:true})).testimony, false);
});

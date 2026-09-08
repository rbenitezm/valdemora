import { test } from 'node:test';
import assert from 'node:assert/strict';
import { advance, initialState, restore, questions, requiredWitnesses, keyWitnesses, confrontationIds, type GameState } from './case.ts';

void test('key interviews gate reconstruction and the final resolution', () => {
  const completeInterior: GameState = { version: 1, found: [1, 2, 3, 4, 5, 6, 7], deduction: true, answers: ['sound', 'sight', 'photo'], testimony: true, exterior: true, interior: true, interviews: [], confrontations: [], reconstruction: false, solved: false, giftOpened: false };
  assert.deepEqual(advance(completeInterior, { type: 'reconstruct' }), completeInterior);
  assert.deepEqual(advance(completeInterior, { type: 'confront', id: 'argument' }), completeInterior);
  let state = completeInterior;
  for (const id of requiredWitnesses.slice(0, -1)) state = advance(state, { type: 'interview', id });
  assert.equal(advance(state, { type: 'reconstruct' }).reconstruction, false);
  state = advance(state, { type: 'interview', id: requiredWitnesses.at(-1)! });
  assert.equal(advance(state, { type: 'reconstruct' }).reconstruction, false);
  assert.deepEqual(advance(state, { type: 'confront', id: 'unknown' }), state);
  for (const id of confrontationIds) state = advance(state, { type: 'confront', id });
  state = advance(state, { type: 'confront', id: confrontationIds[0] });
  assert.deepEqual(state.confrontations, [...confrontationIds]);
  state = advance(state, { type: 'reconstruct' });
  assert.equal(state.reconstruction, true);
  state = advance(state, { type: 'solve' });
  assert.equal(state.solved, true);
  state = advance(state, { type: 'gift' });
  assert.equal(state.giftOpened, true);
  assert.deepEqual(restore(JSON.stringify(state)), state);
  assert.equal(restore(JSON.stringify({ ...state, reconstruction: false })).solved, false);
  assert.equal(restore(JSON.stringify({ ...state, solved: false })).giftOpened, false);
});

void test('interior unlocks after exterior and survives reload with all seven clues', () => {
  assert.deepEqual(advance(initialState, { type: 'discover', id: 1 }), initialState);
  let state = restore(JSON.stringify({ version: 1, found: [4, 6, 7], deduction: true, answers: ['sound', 'sight', 'photo'], testimony: true, exterior: true }));
  assert.equal(state.exterior, true);
  assert.equal(state.interior, false);
  for (const id of [1, 2, 3] as const) state = advance(state, { type: 'discover', id });
  assert.equal(advance(state, { type: 'interior' }).interior, false);
  state = advance(state, { type: 'discover', id: 5 });
  state = advance(state, { type: 'interior' });
  assert.deepEqual(state.found, [1, 2, 3, 4, 5, 6, 7]);
  assert.equal(state.interior, true);
  assert.deepEqual(restore(JSON.stringify(state)), state);
  assert.deepEqual(advance(state, { type: 'discover', id: 1 }), state);
  const invalid = restore(JSON.stringify({ ...state, exterior: false }));
  assert.deepEqual(invalid.found, [4, 6, 7]);
  assert.equal(invalid.interior, false);
});

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

void test('exterior requires testimony and both clues, preserves old saves and revisits', () => {
  assert.deepEqual(advance(initialState, { type: 'discover', id: 6 }), initialState);
  assert.equal(advance(initialState, { type: 'exterior' }).exterior, false);
  let state = restore(JSON.stringify({ version: 1, found: [4], deduction: true, answers: ['sound', 'sight', 'photo'], testimony: true }));
  assert.equal(state.testimony, true);
  assert.equal(state.exterior, false);
  state = advance(state, { type: 'discover', id: 7 });
  assert.equal(advance(state, { type: 'exterior' }).exterior, false);
  state = advance(state, { type: 'discover', id: 6 });
  state = advance(state, { type: 'discover' });
  state = advance(state, { type: 'discover', id: 7 });
  assert.deepEqual(state.found, [4, 6, 7]);
  state = advance(state, { type: 'exterior' });
  assert.equal(state.exterior, true);
  assert.deepEqual(restore(JSON.stringify(state)), state);
  assert.deepEqual(restore(JSON.stringify({ version: 1, found: [6, 7], testimony: true, exterior: true })), initialState);
});

void test('confrontations gate the reconstruction and old saves keep their progress', () => {
  const interviewed = { version: 1, found: [1, 2, 3, 4, 5, 6, 7], deduction: true, answers: ['sound', 'sight', 'photo'], testimony: true, exterior: true, interior: true, interviews: [...requiredWitnesses] };
  let state = restore(JSON.stringify({ ...interviewed, confrontations: ['argument', 'bogus'], reconstruction: true }));
  assert.deepEqual(state.confrontations, ['argument']);
  assert.equal(state.reconstruction, false);
  state = restore(JSON.stringify({ ...interviewed, reconstruction: true, solved: true }));
  assert.deepEqual(state.confrontations, [...confrontationIds]);
  assert.equal(state.solved, true);
  state = restore(JSON.stringify({ ...interviewed, interviews: ['daniel'], confrontations: [...confrontationIds] }));
  assert.deepEqual(state.confrontations, []);
});

void test('all nine statements are required, but old saves with the four key ones keep their progress', () => {
  assert.equal(requiredWitnesses.length, 9);
  const base = { version: 1, found: [1, 2, 3, 4, 5, 6, 7], deduction: true, answers: ['sound', 'sight', 'photo'], testimony: true, exterior: true, interior: true };
  const keyOnly = restore(JSON.stringify({ ...base, interviews: [...keyWitnesses] }));
  assert.deepEqual(advance(keyOnly, { type: 'confront', id: 'argument' }), keyOnly);
  const legacy = restore(JSON.stringify({ ...base, interviews: [...keyWitnesses], confrontations: ['argument'] }));
  assert.deepEqual(legacy.confrontations, ['argument']);
  const finished = restore(JSON.stringify({ ...base, interviews: [...keyWitnesses], reconstruction: true, solved: true }));
  assert.equal(finished.solved, true);
});

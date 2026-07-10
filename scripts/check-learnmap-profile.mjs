#!/usr/bin/env node

import assert from 'node:assert/strict';

import {
  LEGACY_PROFILE_STORAGE_KEYS,
  PROFILE_SCHEMA_VERSION,
  PROFILE_STORAGE_KEY,
  createEmptyProfile,
  migrateProfile,
  sanitizeProfile,
} from '../learnmap/profile-schema.js';

assert.equal(PROFILE_SCHEMA_VERSION, 2);
assert.equal(PROFILE_STORAGE_KEY, 'dexa.learnmap.v2');
assert.deepEqual(LEGACY_PROFILE_STORAGE_KEYS, ['dexa.learnmap.v1']);
assert.deepEqual(createEmptyProfile(), {
  version: 2,
  nickname: '',
  grade: '',
  subjects: [],
  statuses: {},
  favorites: [],
});

const legacy = {
  version: 1,
  nickname: ' 별이 ',
  grade: '3-4',
  subjects: ['Mathematics', 'Mathematics', 'Science'],
  statuses: { topicA: 'practicing', topicB: 'preview' },
  favorites: ['topicA', 'topicA', 'topicB'],
};
assert.deepEqual(migrateProfile(legacy), { ...legacy, version: 2 });
assert.deepEqual(
  sanitizeProfile(legacy, {
    gradeIds: new Set(['3-4']),
    subjectIds: new Set(['Mathematics']),
    nodeIds: new Set(['topicA']),
  }),
  {
    version: 2,
    nickname: '별이',
    grade: '3-4',
    subjects: ['Mathematics'],
    statuses: { topicA: 'practicing' },
    favorites: ['topicA'],
  },
);

assert.equal(migrateProfile({ ...legacy, version: 3 }), null);
assert.equal(migrateProfile([]), null);
assert.deepEqual(
  sanitizeProfile({
    version: 2,
    nickname: '123456789012345678901234567890',
    grade: '9-10',
    subjects: ['Unknown'],
    statuses: { topicA: 'diagnosed', topicB: 'familiar' },
    favorites: ['topicA', 'topicB'],
  }, {
    gradeIds: new Set(['1-2']),
    subjectIds: new Set(['Mathematics']),
    nodeIds: new Set(['topicB']),
  }),
  {
    version: 2,
    nickname: '123456789012345678901234',
    grade: '',
    subjects: [],
    statuses: { topicB: 'familiar' },
    favorites: ['topicB'],
  },
);

console.log('learnmap profile migration: PASS (v1 -> v2 preservation / sanitization / unsupported schema rejection)');

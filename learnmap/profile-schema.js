export const PROFILE_SCHEMA_VERSION = 2;
export const PROFILE_STORAGE_KEY = 'dexa.learnmap.v2';
export const LEGACY_PROFILE_STORAGE_KEYS = Object.freeze(['dexa.learnmap.v1']);

const VALID_STATUSES = new Set(['familiar', 'practicing', 'preview']);

export function createEmptyProfile() {
  return {
    version: PROFILE_SCHEMA_VERSION,
    nickname: '',
    grade: '',
    subjects: [],
    statuses: {},
    favorites: [],
  };
}

export function migrateProfile(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const version = Number(value.version);
  if (version !== 1 && version !== PROFILE_SCHEMA_VERSION) return null;
  return { ...value, version: PROFILE_SCHEMA_VERSION };
}

export function sanitizeProfile(value, allowed = {}) {
  const migrated = migrateProfile(value);
  const profile = createEmptyProfile();
  if (!migrated) return profile;

  profile.nickname = String(migrated.nickname ?? '').trim().slice(0, 24);
  profile.grade = String(migrated.grade ?? '');
  profile.subjects = uniqueStrings(migrated.subjects);
  profile.favorites = uniqueStrings(migrated.favorites);

  if (migrated.statuses && typeof migrated.statuses === 'object' && !Array.isArray(migrated.statuses)) {
    for (const [nodeId, status] of Object.entries(migrated.statuses)) {
      if (VALID_STATUSES.has(status)) profile.statuses[String(nodeId)] = status;
    }
  }

  if (allowed.gradeIds && !allowed.gradeIds.has(profile.grade)) profile.grade = '';
  if (allowed.subjectIds) profile.subjects = profile.subjects.filter((id) => allowed.subjectIds.has(id));
  if (allowed.nodeIds) {
    profile.favorites = profile.favorites.filter((id) => allowed.nodeIds.has(id));
    profile.statuses = Object.fromEntries(
      Object.entries(profile.statuses).filter(([id]) => allowed.nodeIds.has(id)),
    );
  }

  return profile;
}

function uniqueStrings(value) {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.map((item) => String(item)).filter(Boolean))];
}

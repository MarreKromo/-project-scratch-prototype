const K = 'project-scratch-v1';
export const getAccountStorageKey = (userId) => {
  if (typeof userId !== 'string' || !userId.trim()) {
    throw new Error('ACCOUNT_ID_REQUIRED');
  }

  return `project-scratch-v1-user-${userId}`;
};

const LEGACY_DEMO_KEY = 'project-scratch-v04';
export const createId = prefix => {
  if (globalThis.crypto?.randomUUID) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}`;
};

const createIdentity = () => ({
  id: createId('guest'),
  type: 'guest',
  createdAt: new Date().toISOString(),
  claimedAt: null,
  accountId: null
});

const emptyProfile = () => ({
  selfReportedHandicap: null,
  targetHandicap: null,
  handicapHistory: []
});

const emptyOnboarding = () => ({
  status: 'not_started',
  completedAt: null
});

export const createInitialState = () => ({
  schemaVersion: 1,

  identity: createIdentity(),

  onboarding: emptyOnboarding(),

  profile: emptyProfile(),

  journey: null,

  courses: [],

  activeRound: null,

  rounds: [],

equipment: {
  clubs: []
},
training: {
  activities: []
},
coach: {
    analyses: [],
    activeFocus: null
  },

  sync: {
    localRevision: 0,
    pending: []
  }
});


export const load = () => {
  let stored;

  try {
    stored = localStorage.getItem(K);
  } catch (error) {
    throw new Error(
      'STORAGE_READ_FAILED',
      { cause: error }
    );
  }

  if (stored === null) {
    return createInitialState();
  }

  try {
    const parsed = JSON.parse(stored);

    
    if (
      !parsed ||
      typeof parsed !== 'object' ||
      Array.isArray(parsed) ||
      ('rounds' in parsed && !Array.isArray(parsed.rounds))
    ) {
      throw new Error('Invalid stored state');
    }

    return parsed;
  } catch (error) {
    throw new Error(
      'STORAGE_CORRUPTED',
      { cause: error }
    );
  }
};


export const save = state => {
  localStorage.setItem(
    K,
    JSON.stringify({
      ...state,
      schemaVersion: 1
    })
  );
};

export const normalize = state => {
  const base = {
  ...createInitialState(),
  identity: state?.identity || createIdentity()
};

  return {
    ...base,
    ...state,

    identity: {
      ...base.identity,
      ...(state?.identity || {})
    },

    onboarding: {
      ...base.onboarding,
      ...(state?.onboarding || {})
    },

    profile: {
      ...base.profile,
      ...(state?.profile || {}),
      handicapHistory: Array.isArray(
        state?.profile?.handicapHistory
      )
        ? state.profile.handicapHistory
        : []
    },

    courses: Array.isArray(state?.courses)
      ? state.courses
      : [],

    rounds: Array.isArray(state?.rounds)
  ? state.rounds
  : [],

equipment: {
  ...base.equipment,
  ...(state?.equipment || {}),
  clubs: Array.isArray(state?.equipment?.clubs)
    ? state.equipment.clubs
    : []
},

 training: {
  ...base.training,
  ...(state?.training || {}),
  activities: Array.isArray(state?.training?.activities)
    ? state.training.activities
    : []
},
    
coach: {
      ...base.coach,
      ...(state?.coach || {}),
      analyses: Array.isArray(state?.coach?.analyses)
        ? state.coach.analyses
        : []
    },

    sync: {
      ...base.sync,
      ...(state?.sync || {}),
      pending: Array.isArray(state?.sync?.pending)
        ? state.sync.pending
        : []
    }
  };
};

export const updateHandicap = (profile, value) => {
  const handicap = Number(value);

  if (!Number.isFinite(handicap)) {
    return profile;
  }

  if (profile?.selfReportedHandicap === handicap) {
    return profile;
  }

  return {
    ...emptyProfile(),
    ...profile,

    selfReportedHandicap: handicap,

    handicapHistory: [
      ...(profile?.handicapHistory || []),
      {
        id: createId('hcp'),
        value: handicap,
        recordedAt: new Date().toISOString(),
        source: 'user'
      }
    ]
  };
};


export const createClub = ({
  ownerId,
  type,
  label,
  loft = null
}) => {
  const now = new Date().toISOString();

  return {
    id: createId('club'),
    ownerId,
    type,
    label,
    loft,
    status: 'active',
    revision: 1,
    createdAt: now,
    updatedAt: now,
    retiredAt: null
  };
};

export const updateClub = (club, changes = {}) => {
  if (!club || club.status !== 'active') {
    return club;
  }

  const allowed = {};

  if ('type' in changes) {
    allowed.type = changes.type;
  }

  if ('label' in changes) {
    allowed.label = changes.label;
  }

  if ('loft' in changes) {
    allowed.loft = changes.loft;
  }

  if (Object.keys(allowed).length === 0) {
    return club;
  }

  return {
    ...club,
    ...allowed,
    revision: (club.revision || 1) + 1,
    updatedAt: new Date().toISOString()
  };
};

export const retireClub = club => {
  if (!club || club.status === 'retired') {
    return club;
  }

  const now = new Date().toISOString();

  return {
    ...club,
    status: 'retired',
    revision: (club.revision || 1) + 1,
    updatedAt: now,
    retiredAt: now
  };
};

export const replaceClub = (club, replacement = {}) => {
  if (!club || club.status !== 'active') {
    return null;
  }

  const retiredClub = retireClub(club);

  const newClub = createClub({
    ownerId: club.ownerId,
    type: replacement.type ?? club.type,
    label: replacement.label ?? club.label,
    loft: replacement.loft ?? club.loft
  });

  return {
    retiredClub,
    newClub
  };
};

export const hasLegacyDemoData = () =>
  localStorage.getItem(LEGACY_DEMO_KEY) !== null;

export const createTrainingActivity = ({
  ownerId,
  type,
  durationMinutes,
  occurredAt = new Date().toISOString(),
  source = 'manual',
  category = null,
  clubIds = []
}) => {
  const now = new Date().toISOString();

  return {
    id: createId('training'),
    ownerId,
    type,
    durationMinutes,
    occurredAt,
    source,
    category,
    clubIds: Array.isArray(clubIds) ? clubIds : [],
    status: 'active',
    revision: 1,
    createdAt: now,
    updatedAt: now
  };
};

export const updateTrainingActivity = (
  activity,
  changes = {}
) => {
  if (!activity || activity.status !== 'active') {
    return activity;
  }

  const allowed = {};

  if ('type' in changes) {
    allowed.type = changes.type;
  }

  if ('durationMinutes' in changes) {
    allowed.durationMinutes = changes.durationMinutes;
  }

  if ('occurredAt' in changes) {
    allowed.occurredAt = changes.occurredAt;
  }

  if ('category' in changes) {
    allowed.category = changes.category;
  }

  if ('clubIds' in changes) {
    allowed.clubIds = Array.isArray(changes.clubIds)
      ? changes.clubIds
      : [];
  }

  if (Object.keys(allowed).length === 0) {
    return activity;
  }

  return {
    ...activity,
    ...allowed,
    revision: (activity.revision || 1) + 1,
    updatedAt: new Date().toISOString()
  };
};

export const voidTrainingActivity = activity => {
  if (!activity || activity.status !== 'active') {
    return activity;
  }

  const now = new Date().toISOString();

  return {
    ...activity,
    status: 'voided',
    revision: (activity.revision || 1) + 1,
    updatedAt: now,
    voidedAt: now
  };
};

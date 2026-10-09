
export const hasLocalGuestData = state => {
  if (state?.identity?.type !== 'guest') {
    return false;
  }

  const profile = state.profile;

  return (
    (state.rounds?.length || 0) > 0 ||
    (state.training?.activities?.length || 0) > 0 ||
    (state.equipment?.clubs?.length || 0) > 0 ||
    (state.courses?.length || 0) > 0 ||
    (state.coach?.analyses?.length || 0) > 0 ||
    state.coach?.activeFocus != null ||
    state.activeRound != null ||
    state.journey != null ||
    profile?.selfReportedHandicap != null ||
    profile?.targetHandicap != null ||
    (profile?.handicapHistory?.length || 0) > 0 ||
    state.onboarding?.status === 'completed'
  );
};

export const getAccountTransition = state => {
  if (hasLocalGuestData(state)) {
    return {
      allowed: false,
      reason: 'GUEST_DATA_REQUIRES_DECISION'
    };
  }

  return {
    allowed: true,
    reason: null
  };
};

export const getGuestDataDecision = (
  state,
  choice
) => {
  if (!hasLocalGuestData(state)) {
    return {
      action: 'CONTINUE',
      requiresConfirmation: false
    };
  }

  if (choice === 'KEEP_SEPARATE') {
    return {
      action: 'PRESERVE_GUEST_DATA',
      requiresConfirmation: false
    };
  }

  if (choice === 'REQUEST_IMPORT') {
    return {
      action: 'PREPARE_IMPORT',
      requiresConfirmation: true
    };
  }

  return {
    action: 'WAIT_FOR_USER',
    requiresConfirmation: true
  };
};


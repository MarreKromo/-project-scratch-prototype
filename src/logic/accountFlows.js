export const hasLocalGuestData = state => {
  if (state?.identity?.type !== 'guest') {
    return false;
  }

  return (
    (state.rounds?.length || 0) > 0 ||
    (state.training?.activities?.length || 0) > 0 ||
    (state.equipment?.clubs?.length || 0) > 0 ||
    (state.courses?.length || 0) > 0 ||
    state.activeRound !== null &&
      state.activeRound !== undefined
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

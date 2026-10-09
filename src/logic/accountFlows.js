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

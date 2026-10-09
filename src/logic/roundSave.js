export function persistCompletedRound(saveState, state, savedRound) {
  const nextRounds = [...state.rounds, savedRound];

  saveState({
    ...state,
    activeRound: null,
    lastRound: savedRound,
    rounds: nextRounds
  });

  return nextRounds;
}

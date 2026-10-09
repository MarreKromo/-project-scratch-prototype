export const canAccessAccountData = (
  sessionAccountId,
  dataOwnerAccountId
) => {
  if (
    typeof sessionAccountId !== 'string' ||
    typeof dataOwnerAccountId !== 'string'
  ) {
    return false;
  }

  if (
    sessionAccountId.trim() === '' ||
    dataOwnerAccountId.trim() === ''
  ) {
    return false;
  }

  return sessionAccountId === dataOwnerAccountId;
};

export const getAccountSwitchDecision = (
  currentAccountId,
  nextAccountId
) => {
  if (
    typeof currentAccountId !== 'string' ||
    currentAccountId.trim() === ''
  ) {
    return {
      allowed: false,
      reason: 'CURRENT_ACCOUNT_UNKNOWN'
    };
  }

  if (
    typeof nextAccountId !== 'string' ||
    nextAccountId.trim() === ''
  ) {
    return {
      allowed: false,
      reason: 'NEXT_ACCOUNT_UNKNOWN'
    };
  }

  if (currentAccountId === nextAccountId) {
    return {
      allowed: true,
      requiresDataIsolation: false
    };
  }

  return {
    allowed: false,
    reason: 'ACCOUNT_DATA_ISOLATION_REQUIRED'
  };
};


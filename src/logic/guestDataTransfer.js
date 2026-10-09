export const getGuestTransferDecision = ({
  guestId,
  accountId,
  confirmed,
  accountHasData
} = {}) => {
  if (
    typeof guestId !== 'string' ||
    guestId.trim() === '' ||
    typeof accountId !== 'string' ||
    accountId.trim() === ''
  ) {
    return {
      allowed: false,
      reason: 'INVALID_IDENTITY'
    };
  }

  if (confirmed !== true) {
    return {
      allowed: false,
      reason: 'CONFIRMATION_REQUIRED'
    };
  }

  if (accountHasData !== false) {
    return {
      allowed: false,
      reason: 'ACCOUNT_DATA_REVIEW_REQUIRED'
    };
  }

  return {
    allowed: true,
    action: 'PREPARE_GUEST_IMPORT',
    preserveGuestBackup: true
  };
};


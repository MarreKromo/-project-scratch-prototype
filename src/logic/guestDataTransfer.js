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

export const getGuestImportCompletion = ({
  importVerified,
  guestBackupPreserved,
  accountOwnershipVerified
} = {}) => {
  if (guestBackupPreserved !== true) {
    return {
      allowed: false,
      reason: 'GUEST_BACKUP_NOT_PRESERVED'
    };
  }

  if (accountOwnershipVerified !== true) {
    return {
      allowed: false,
      reason: 'ACCOUNT_OWNERSHIP_NOT_VERIFIED'
    };
  }

  if (importVerified !== true) {
    return {
      allowed: false,
      reason: 'IMPORT_NOT_VERIFIED'
    };
  }

  return {
    allowed: true,
    reason: null
  };
};


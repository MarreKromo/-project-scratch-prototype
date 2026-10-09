export const getAccountStorageKey = accountId => {
  if (
    typeof accountId !== 'string' ||
    accountId.trim() === ''
  ) {
    return null;
  }

  return `project-scratch-account:${accountId}`;
};

export const getGuestStorageKey = guestId => {
  if (
    typeof guestId !== 'string' ||
    guestId.trim() === ''
  ) {
    return null;
  }

  return `project-scratch-guest:${guestId}`;
};


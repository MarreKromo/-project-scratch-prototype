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

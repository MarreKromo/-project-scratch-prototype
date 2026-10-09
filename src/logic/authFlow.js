export const getAuthFlowDecision = ({
  action,
  email,
  emailVerified,
  sessionValid
} = {}) => {
  if (action === 'REGISTER') {
    if (
      typeof email !== 'string' ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      return {
        allowed: false,
        reason: 'INVALID_EMAIL'
      };
    }

    return {
      allowed: true,
      nextStep: 'REQUEST_EMAIL_VERIFICATION'
    };
  }

  if (action === 'SIGN_IN') {
    if (sessionValid !== true) {
      return {
        allowed: false,
        reason: 'VALID_SESSION_REQUIRED'
      };
    }

    if (emailVerified !== true) {
      return {
        allowed: false,
        reason: 'EMAIL_VERIFICATION_REQUIRED'
      };
    }

    return {
      allowed: true,
      nextStep: 'CHECK_ACCOUNT_DATA'
    };
  }

  if (action === 'RECOVER_PASSWORD') {
    return {
      allowed: true,
      nextStep: 'REQUEST_RECOVERY_EMAIL'
    };
  }

  return {
    allowed: false,
    reason: 'UNKNOWN_ACTION'
  };
};


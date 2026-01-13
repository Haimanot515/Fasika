const ROLES = ['buyer', 'farmer', 'both', 'admin'];

module.exports = {
  CHANNELS: ['WEB', 'USSD', 'MOBILE'],
  VERIFICATION_METHODS: ['EMAIL', 'SMS', 'VOICE'],
  ACCOUNT_STATUS: {
    PENDING: 'PENDING',
    ACTIVE: 'ACTIVE',
    SUSPENDED: 'SUSPENDED',
    DELETED: 'DELETED'
  },
  ROLES,
  OTP_EXPIRY_MINUTES: 7,
  MAX_VERIFICATION_ATTEMPTS: 10000,
  PASSWORD_REGEX: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/,
  NAME_REGEX: /^[a-zA-Z\s]+$/,
  MAX_LENGTHS: {
    full_name: 150,
    phone: 20,
    email: 150,
    region: 100,
    zone: 100,
    woreda: 100,
    kebele: 100
  }
};

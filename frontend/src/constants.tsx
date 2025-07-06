// API paths
const baseAPIUrl = import.meta.env.VITE_API_BASE_URL;
const codesAPIUrl = `${baseAPIUrl}/codes`;
const authAPIUrl = `${baseAPIUrl}/auth`;
const sysAdminAPIUrl = `${baseAPIUrl}/sys-admin`;
const statsAPIUrl = `${baseAPIUrl}/stats`;

const baseWebSocketUrl = `${import.meta.env.VITE_WS_BASE_API_URL}/api/v1`;

const defaultCodeExpirationTime = 5; // seconds
const expirationCountdownInterval = 1000; // milliseconds
const toastDuration = 2000; // milliseconds
const inputResetDelay = 1000; // milliseconds
const checkMarksDuration = 2000; // milliseconds

const role_names = {
  student: "student",
  lecturer: "lecturer",
  admin: "admin",
  "sys admin": "sys admin",
  security: "security",
};

export {
  sysAdminAPIUrl,
  statsAPIUrl,
  baseAPIUrl,
  baseWebSocketUrl,
  codesAPIUrl,
  defaultCodeExpirationTime,
  checkMarksDuration,
  expirationCountdownInterval,
  authAPIUrl,
  toastDuration,
  role_names,
  inputResetDelay,
};

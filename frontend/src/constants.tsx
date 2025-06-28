// API paths
const baseHost = "http://127.0.0.1";
const baseAPIUrl = `${baseHost}:8000/api/v1`;
const codesAPIUrl = `${baseAPIUrl}/codes`;
const authAPIUrl = `${baseAPIUrl}/auth`;
const sysAdminAPIUrl = `${baseAPIUrl}/sys-admin`;
const statsAPIUrl = `${baseAPIUrl}/stats`;

const baseWebSocketUrl = "ws://127.0.0.1:8000/api/v1";

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

// API paths
const baseAPIUrl = "http://127.0.0.1:8000/api/v1";
const codesAPIUrl = `${baseAPIUrl}/codes`;
const authAPIUrl = `${baseAPIUrl}/auth`;
const baseWebSocketUrl = "ws://127.0.0.1:8000/api/v1";

const codeExpirationTime = 5; // seconds
const expirationCountdownInterval = 1000; // milliseconds
const toastDuration = 2000; // milliseconds
const inputResetDelay = 1000; // milliseconds
const checkMarksDuration = 2000; // milliseconds

const role_names = {
  admin: "admin",
  lecturer: "lecturer",
  security: "security",
  student: "student",
};

export {
  baseAPIUrl,
  baseWebSocketUrl,
  codesAPIUrl,
  codeExpirationTime,
  checkMarksDuration,
  expirationCountdownInterval,
  authAPIUrl,
  toastDuration,
  role_names,
  inputResetDelay,
};

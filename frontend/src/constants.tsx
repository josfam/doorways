// API paths
const baseAPIUrl = "http://127.0.0.1:8000/api/v1";
const codesAPIUrl = `${baseAPIUrl}/codes`;
const authAPIUrl = `${baseAPIUrl}/auth`;

const codeExpirationTime = 5; // seconds
const expirationCountdownInterval = 1000; // milliseconds
const toastDuration = 2000; // milliseconds

const role_names = {
  admin: "admin",
  lecturer: "lecturer",
  security: "security",
  student: "student",
};

export {
  baseAPIUrl,
  codesAPIUrl,
  codeExpirationTime,
  expirationCountdownInterval,
  authAPIUrl,
  toastDuration,
  role_names,
};

const baseAPIUrl = "http://127.0.0.1:8000/api/v1";
const codesAPIUrl = `${baseAPIUrl}/codes`;

const codeExpirationTime = 5; // seconds
const expirationCountdownInterval = 1000; // milliseconds

export {
  baseAPIUrl,
  codesAPIUrl,
  codeExpirationTime,
  expirationCountdownInterval,
};

/*
 * Token for the password-reset flow.
 *
 * The backend returns access/refresh tokens from /users/forgot-password and
 * /users/verify-forgotOtp because the follow-up calls sit behind `authorize`.
 * Writing them into localStorage.accessToken made the app treat the visitor as
 * signed in: the navbar showed an account and GuestRoute bounced /login to
 * /home, so going "back" from the forgot-password page landed on the home page
 * as a logged-in user even though they had never signed in.
 *
 * Kept under its own sessionStorage key and sent explicitly per request, so it
 * authorises the reset without ever looking like a login session.
 */
const RESET_TOKEN_KEY = "passwordResetToken";

const storage = () => {
  if (typeof window === "undefined") return null;
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
};

export const getPasswordResetToken = () => storage()?.getItem(RESET_TOKEN_KEY) || null;

export const setPasswordResetToken = (token) => {
  const store = storage();
  if (!store || !token) return;
  try {
    store.setItem(RESET_TOKEN_KEY, token);
  } catch {
    // Storage unavailable; the reset request will simply fail on its own.
  }
};

export const clearPasswordResetToken = () => {
  const store = storage();
  if (!store) return;
  try {
    store.removeItem(RESET_TOKEN_KEY);
  } catch {
    // ignore
  }
};

// Header for the authorize-protected calls in the reset flow. Returns an empty
// object when there is no token so the request still goes out and the backend
// can answer with a proper 401 instead of failing locally.
export const passwordResetAuthHeader = () => {
  const token = getPasswordResetToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

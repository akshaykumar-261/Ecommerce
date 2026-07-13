import jwt from "jsonwebtoken";
import crypto from "crypto";
export const generateAccessToken = (user, sessionId) => {
  return jwt.sign(
    {
      id: user.id,
      role_Id: user.role_Id,
      email: user.email,
      sessionId,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "15m",
    },
  );
};
export const generateRefreshToken = (user, sessionId) => {
  return jwt.sign(
    {
      id: user.id,
      sessionId,
    },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: "30d",
    },
  );
};

export const generateOtp = (length = 6) => {
  const digit = "0123456789";
  let otp = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(0, digit.length);
    otp += digit[randomIndex];
  }
  return otp;
};

export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

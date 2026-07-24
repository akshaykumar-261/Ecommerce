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
      expiresIn: "1h",
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

export const pagignation = (page = 1, limit = 10, data = null) => {
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 10;
  const offset = (page - 1) * limit;
  if (!data) {
    return {
      page,
      limit,
      offset,
    };
  }
  return {
    totalRecords: data.count,
    totalPages: Math.ceil(data.count / limit),
    currcurrentPage: page,
    pageSize: limit,
    data: data.rows,
  };
};

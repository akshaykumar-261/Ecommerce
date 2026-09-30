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

/*
 * The price a customer actually pays for one unit.
 *
 * discount_price is the discounted unit price (not a percentage), which is how
 * the storefront already renders it. It is only honoured when it is a real
 * discount — a missing, zero or above-MRP value falls back to price, so a
 * pricing mistake can never charge someone more than the listed price.
 *
 * Kept here so the cart total, the order, the vendor split and the Stripe
 * amount can never disagree about what a product costs.
 */
export const getEffectiveUnitPrice = (product) => {
  const price = Number(product?.price) || 0;
  const discountPrice = Number(product?.discount_price) || 0;
  return discountPrice > 0 && discountPrice < price ? discountPrice : price;
};

// Line total for a cart/order item, i.e. unit price x quantity.
export const getEffectiveLineTotal = (product, quantity) =>
  getEffectiveUnitPrice(product) * (Number(quantity) || 0);

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
    currentPage: page,
    pageSize: limit,
    data: data.rows,
  };
};

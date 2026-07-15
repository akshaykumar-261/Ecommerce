export const sendResponse = (res, statusCode, message, data = null) => {
  return res.status(statusCode).json({
    message,
    data,
  });
};

export const respnseHandler = sendResponse;

class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something went Wrong",
    errors = [],
    stack = "",
  ) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.data = this.data;
    this.success = false;
    this.errors = errors;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

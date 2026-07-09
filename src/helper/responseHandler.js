const respnseHandler = (res, statusCode, message, data = null) => {
  return res.status(statusCode).json({
    statusCode,
    message,
    data,
  });
};
export default respnseHandler;

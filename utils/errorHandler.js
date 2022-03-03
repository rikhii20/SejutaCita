module.exports = (res, error) => {
  return res.status(500).json({
    status: "Internal server error",
    message: error.message,
  });
};

const CtrlWraper = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      // console.log(`err.code - ${error.code}`);
      next(error);
    }
  };
};

module.exports = CtrlWraper;

const CrtlWraper = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      console.log(`err.code - ${err.code}`);
      next(error);
    }
  };
};

module.exports = CrtlWraper;

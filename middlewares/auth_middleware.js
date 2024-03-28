const { validateToken } = require('../services/authentication');

async function ProtectedRoute(cookiename) {
  return async (req, res, next) => {
    const cookieValue = req.cookies[cookiename];

    if (!cookieValue) {
      return next();
    }

    try {
      const userPayload = await validateToken(cookieValue);
      req.user = userPayload;
      next();
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: 'middleware me error' });
    }
  };
}

module.exports = { ProtectedRoute };
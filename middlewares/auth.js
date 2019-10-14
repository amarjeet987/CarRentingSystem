const config = require('config');
const jwt = require('jsonwebtoken');

module.exports = function auth(req, res, next) {
  const token = req.header('x-auth-token');
  if(!token) {
    // check if token exists
    res.status(401).json({ error : "Access unauthorized, please login first." });
  }
  // if exists, verify it and send corresponding response
  try {
    req.user = jwt.verify(token, config.get('jwtSecretKey'));
    next();
  } catch(e) {
    res.status(401).json({ error: "Invalid token."});
  }
}

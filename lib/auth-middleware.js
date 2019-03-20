const jwt = require('jsonwebtoken')
var Diff = require('diff');
var assert = require('assert');

module.exports = {
  verifyJWT: (req, res, next) => {
    try {
      req.user = jwt.verify(req.token, process.env.JWT_SECRET)
      assert(req.user && req.user.sub)
      next()
    } catch (e) {
      res.sendStatus(401)
    }
  }
}

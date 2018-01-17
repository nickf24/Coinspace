const passport = require('passport');
const expressValidator = require('express-validator');
const bcrypt = require('bcrypt');
const saltRounds = 10;

var validateEntry = (req, callback) => {
  req.checkBody('username', 'Username field cannot be empty.').notEmpty();
  req.checkBody('password', 'Password field cannot be empty.').notEmpty();
  req.checkBody('password', 'Password must be between 4-16 characters long.').len(4, 16);

  req.getValidationResult().then((result) => {
    if (!result.isEmpty()) {
      var errors = result.array().map((error) => {
        return error.msg;
      });
      callback(errors, null);
    } else {
      callback(null, 'validated');
    }
  })
}

var hashPassword = (password, callback) => {
  bcrypt.hash(password, saltRounds, (error, hash) => {
    if (error) {
      callback(error, null);
    } else {
      callback(null, hash);
    }
  })
};

var verifyPassword = (password, hash, callback) => {
  bcrypt.compare(password, hash, (error, response) => {
    if (error) {
      callback(error, null);
    } else {
      callback(null, response);
    }
  })
}

module.exports = {
  validateEntry: validateEntry,
  hashPassword: hashPassword,
  verifyPassword: verifyPassword
}
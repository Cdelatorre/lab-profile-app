const createError = require('http-errors');
const User = require('../models/user.model');
const passport = require('passport');

module.exports.register = (req, res, next) => {
  const {
    email
  } = req.body
  User.findOne({
      email: email
    })
    .then(user => {
      if (user) {
        throw createError(409, 'Already registered')
      } else {
        return new User(req.body).save();
      }
    })
    .then(user => res.status(201).json(user))
    .catch(next)
}

module.exports.authenticate = (req, res, next) => {
  passport.authenticate('local-auth', (error, user, message) => {
    if (error) {
      next(error);
    } else if (!user) {
      next(createError(401, message))
    } else {
      req.login(user, (error) => {
        if (error) {
          next(error)
        } else {
          res.status(201).json(user)
        }
      })
    }
  })(req,res,next);
}

module.exports.logout = (req, res, next) => {
  req.logout()
  res.status( 204, "Te echaremos de menos").json();
}

module.exports.getProfile = (req, res, next) => {
  res.json(req.user)

}

module.exports.editProfile = (req, res, next) => {
  const newUser =  { 
    email:  req.body.email,
    campus: req.body.campus,  
    course: req.body.course,
    avatarURL : req.file ? req.file.secure_url : ''
}

console.log(req.user.id)

User.findByIdAndUpdate(req.user.id, {
  $set: newUser
}, {
  safe: true,
  new: true
})
 .then(user => {
  if (!user) {
    next(createError(404, 'User not found'));
  } else {
    res.status(201).json(user)
  }
})
.catch(error => next(error));
throw createError(501, 'Not Implemented')
}
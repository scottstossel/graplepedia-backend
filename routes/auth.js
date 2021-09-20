const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

//GET Users
// router.get('/', async (req, res) => {
//   const users = await User.find();
//   try {
//       return res.status(200).json(users);
//     } catch (error) {
//       return res.status(500).json({message: "Couldn't get the users"})
//     }
//   }
// )

//POST - Sign In
router.post('/signup', async (req, res) => {
  const user = await User.create(req.body);
  try {
    user.salt = undefined;
    user.hashed_password = undefined;
    return res.status(201).json(user)
  } catch (error) {
    return res.status(500).json({message: "Error, check user properties ", error});
  }
})

//POST - Login

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const userToLogin = await User.findOne({email});
  if (!userToLogin) {
    return res.json({message: "User doesn't exist"});
  }
  if (!userToLogin.authenticate(password)) {
    return res.json({message: "Check credentials"});
  }
  const token = jwt.sign({_id: userToLogin._id}, process.env.SECRET);
  res.cookie('t', token, {expire: new Date() + 9999});
  const {_id, name, role} = userToLogin;
  return res.status(201).json({token, user: {_id, email, name, role}});
})

router.post(('/signout', async (req, res) => {
  res.clearCookie('t');
  return res.status(200).json({message: "Signed out successfully"})
}))


module.exports = router;
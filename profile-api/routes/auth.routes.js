const express = require('express');
const router = express.Router();
const auth = require('../controllers/auth.controller');
const uploadCloud = require('../configs/storage.config.js');

router.post('/register', auth.register);
router.post('/authenticate', auth.authenticate);
router.get('/logout', auth.logout);
router.get('/profile', auth.getProfile);
router.put('/profile',uploadCloud.single('imageUrl'), auth.editProfile);

module.exports = router
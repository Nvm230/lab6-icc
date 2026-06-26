const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { upload } = require('../config/s3');

// Middleware to protect routes
const requireAuth = (req, res, next) => {
  if (!req.session.admin) {
    return res.redirect('/auth/login');
  }
  next();
};

router.use(requireAuth);

router.get('/dashboard', userController.getAllUsers);
router.get('/create', userController.getCreateUser);
router.post('/', upload.single('profile_image'), userController.createUser);
router.get('/:id/edit', userController.getEditUser);
router.put('/:id', upload.single('profile_image'), userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;

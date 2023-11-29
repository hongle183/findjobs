const express = require('express');
const router = express.Router();
const userController = require('../app/controllers/UserController');
const passport = require('passport');
const { isLoggedIn, isNotLoggedIn } = require('../util/middleware/userInView');

router.post('/profile/upload-avatar', isLoggedIn, userController.updateAvatar);
router.post(
    '/login',
    isNotLoggedIn,
    passport.authenticate('local.login', { failureRedirect: '/user', failureFlash: true }),
    userController.login,
);
router.post(
    '/register',
    isNotLoggedIn,
    passport.authenticate('local.register', { failureRedirect: '/user', failureFlash: true }),
    userController.register,
);

router.get('/login/facebook', isNotLoggedIn, passport.authenticate('facebook', { scope: ['email'] }));
router.get(
    '/login/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/user' }),
    userController.loginFb,
);

router.get('/login/google', isNotLoggedIn, passport.authenticate('google', { scope: ['email', 'profile'] }));
router.get(
    '/login/google/callback',
    passport.authenticate('google', { failureRedirect: '/user' }),
    userController.loginGg,
);

router.get('/profile/:id', isLoggedIn, userController.profilePage);
router.post('/profile/:id', isLoggedIn, userController.verify, userController.updateProfile);

router.get('/bookmark', isLoggedIn, userController.bookmarkPage);
router.post('/bookmark/delete/:id', isLoggedIn, userController.deleteBookmark);
router.post('/bookmark/:id', isLoggedIn, userController.bookmark);
router.get('/logout', isLoggedIn, userController.logout);
router.get('/', isNotLoggedIn, userController.loginPage);

module.exports = router;

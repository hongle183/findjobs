const express = require('express');
const router = express.Router();
const siteController = require('../app/controllers/SiteController');
const { isLoggedIn, isNotLoggedIn } = require('../util/middleware/userInView');

// router.get('/blog', siteController.blog);
router.get('/single_blog', siteController.single_blog);
router.post('/news', siteController.news);
router.get('/contact', siteController.contactPage);
router.post('/contact', siteController.contact);
router.get('/company', siteController.company);
router.get('/', siteController.index);

module.exports = router;

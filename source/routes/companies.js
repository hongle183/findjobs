const express = require('express');
const router = express.Router();
const companyController = require('../app/controllers/CompanyController');

router.post('/search', companyController.search);
router.get('/sort/:sortby', companyController.sort);
router.get('/:id', companyController.company_detail);
router.get('/', companyController.index);

module.exports = router;
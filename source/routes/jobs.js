const express = require('express');
const router = express.Router();
const jobController = require('../app/controllers/JobController');

router.post('/search', jobController.search);
router.get('/:id', jobController.job_details);
router.get('/sort/:sortby', jobController.sort);
router.get('/', jobController.index);

module.exports = router;

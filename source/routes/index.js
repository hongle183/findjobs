const companiesRouter = require('./companies');
const jobsRouter = require('./jobs');
const userRouter = require('./user');
const siteRouter = require('./site');

module.exports = (app) => {
    app.use('/companies', companiesRouter);
    app.use('/jobs', jobsRouter);
    app.use('/user', userRouter);
    app.use('/', siteRouter);
};
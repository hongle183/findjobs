// “req.isAuthenticated()” function,
// returns “true” in case an authenticated user is present in “req.session.passport.user”, or
// returns “false” in case no authenticated user is present in “req.session.passport.user”.
module.exports = {
    isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        return res.redirect('/user');
    },
    isNotLoggedIn(req, res, next) {
        if (req.isUnauthenticated()) {
            return next();
        }
        return res.redirect('/');
    }
};

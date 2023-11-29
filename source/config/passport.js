const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const User = require('../app/models/User');
const { mongooseToObject } = require('../util/mongoose');

passport.use(
    'local.login',
    new LocalStrategy(
        {
            usernameField: 'email', // default is username, override to accept email
            passwordField: 'password',
            passReqToCallback: true, // allows us to access req in the call back
        },
        (req, email, password, done) => {
            User.findOne({ email })
                .then((user) => {
                    if (!user) {
                        return done(null, false, req.flash('error', 'Email hoặc mật khẩu không đúng'));
                    }
                    if (!user.validPassword(password)) {
                        return done(null, false, req.flash('error', 'Email hoặc mật khẩu không đúng'));
                    }
                    return done(null, user);
                })
                .catch((err) => done(err));
        },
    ),
);

passport.use(
    'local.register',
    new LocalStrategy(
        {
            usernameField: 'email', // default is username, override to accept email
            passwordField: 'password',
            passReqToCallback: true, // allows us to access req in the call back
        },
        (req, email, password, done) => {
            // Tìm một user theo email
            // chúng ta kiểm tra xem user đã tồn tại hay không
            User.findOne({ email })
                .then((user) => {
                    if (user) {
                        return done(null, false, req.flash('error', 'Email này đã được sử dụng'));
                    } else {
                        var newUser = new User({ name: req.body.name, email, password });
                        newUser.password = newUser.generateHash(password);

                        newUser.save();
                        return done(null, newUser);
                    }
                })
                .catch((err) => done(err));
        },
    ),
);

passport.use(
    new FacebookStrategy(
        {
            clientID: '483084210611065',
            clientSecret: '8479d535cd364cbfd2d994cb1bc2a441',
            callbackURL: '/user/login/facebook/callback',
            profileFields: ['id', 'displayName', 'email', 'photos'],
        },
        (accessToken, refreshToken, profile, done) => {
            var _id = 'facebook:' + profile.id;
            User.findOne({ _id })
                .then((user) => {
                    if (user) return done(null, user);
                    newUser = new User({
                        _id,
                        name: profile.displayName,
                        email: profile.emails[0].value,
                        // img: profile.photos[0].value,
                        createAt: Date.now(),
                    });

                    newUser.save();
                    return done(null, newUser);
                })
                .catch((err) => done(err));
        },
    ),
);

passport.use(
    new GoogleStrategy(
        {
            clientID: '24452914095-aaukis6l3bkrq7hnv8f4sm1ng97rqnr2.apps.googleusercontent.com',
            clientSecret: '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',
            callbackURL: '/user/login/google/callback',
            passReqToCallback: true,
        },
        (request, accessToken, refreshToken, profile, done) => {
            var _id = 'google:' + profile.id;
            User.findOne({ _id })
                .then((user) => {
                    if (user) return done(null, user);
                    user = new User({
                        _id,
                        name: profile.displayName,
                        email: profile.emails[0].value,
                        img: profile.picture,
                        createAt: Date.now(),
                    });

                    user.save();
                    return done(null, user);
                })
                .catch((err) => done(err));
        },
    ),
);

passport.serializeUser((user, done) => {
    return done(null, user.email);
});

passport.deserializeUser((email, done) => {
    User.findOne({ email })
        .then((user) => done(null, { _id: user._id, email: user.email, name: user.name, img: user.img }))
        .catch((err) => done(err));
});

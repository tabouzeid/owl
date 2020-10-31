const passport = require("passport");
const bcrypt = require("bcryptjs");
const db = require("../models");
const LocalStrategy = require("passport-local").Strategy;

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    db.User.findOne({ where: { id: id }, raw: true })
        .then((response) => {
            done(null, response);
        })
        .catch((err) => done(err, null));
});

// Telling passport we want to use a Local Strategy. In other words, we want login with a username/email and password
passport.use(
    new LocalStrategy(
        // Our user will sign in using an email, rather than a "username"
        {
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true,
        },
        /**
         * This is the Auth handler. We check for a valid user phone and authenticate if found
         */
        async function (req, email, password, done) {
            const user = await db.User.findOne({ where: { email: email }, raw: true })
            // successful query to database
            if (!user) {
                return done(null, false, { message: 'Unknown user ' + email });
            }

            const passwordMatch = await bcrypt.compare(password, user.password)
            if (!passwordMatch) {
                return done('Invalid credentials', false)
            }
            return done(null, user);
        }
    )
);

// Exporting our configured passport
module.exports = passport;

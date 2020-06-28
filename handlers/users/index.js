
const User = require("./User")
const jwt = require('../../utils/jwt')
const { cookie } = require('../../config/config')

module.exports = {
    get: {
        login(req, res, next) {
            res.render('users/login.hbs')
        },

        register(req, res, next) {
            res.render('users/register.hbs')
        },

        logout(req, res, next) {
            req.user = null;
            res.clearCookie(cookie).redirect('/home/')

        }
    },
    post: {
        login(req, res, next) {
            const { username, password } = req.body;

            User.findOne({ username })
                .then((user) => {
                    return Promise.all([user, user.matchPassword(password)])
                }).then(([user, match]) => {
                    if (!match) {
                        next(err);
                        //oldInput: { email, password}
                        return
                    }
                    const token = jwt.createToken(user);

                    res.status(201)
                        .cookie(cookie, token, { maxAge: 3600000 })
                        .redirect('/home/');
                })

        },

        register(req, res, next) {
            const { username, password, repeatPassword } = req.body;

            if (password !== repeatPassword) {
                res.render('users/register.hbs', {
                    message: "Password do not match!",
                    oldInput: { username, password, repeatPassword }

                });
                return;
            }

            User.findOne({username }).then((currentUser) => {
                if (currentUser) { throw new Error("The given username is already used!") }
                return User.create({ username, password })
            }).then((currentUser) => {
                res.redirect('/users/login');
            }).catch((err) => {
                res.render('users/register.hbs', {
                    message: err.message,
                    oldInput: { username, password, repeatPassword }
                });
            })

        }

    }
};
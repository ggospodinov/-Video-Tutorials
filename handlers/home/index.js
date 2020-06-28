const Course = require('../courses/Course')

module.exports = {
    get: {
        home(req, res, next) {

            Course.find({ isPublic: true }).
                limit(3)
                .lean()
                .then((courses) => {
                    res.render('home/home.hbs', {
                        isLoggedIn: req.user !== undefined,
                        username: req.user ? req.user.username : '',
                        courses

                    });

                })

        }
    },
    post: {

    }
}
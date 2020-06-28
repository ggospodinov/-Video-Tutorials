const router = require('../routes');

module.exports = (app) => {
  app.use('/home', router.home);

   app.use('/users', router.users);

    app.use('/courses', router.courses);

    app.use('*', (req, res, next) => {
       res.send('<h1>NOOOOOOO</h1>')
    })
};
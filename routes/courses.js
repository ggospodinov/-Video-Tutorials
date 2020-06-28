const router = require('express').Router();
const handler = require('../handlers/courses');
const isAuth = require('../utils/isAuth');
const validations = require('../utils/validator')


router.get('/create-course', isAuth(), handler.get.createCourse)
router.get('/details-course/:id', isAuth(), handler.get.detailsCourse)
router.get('/enroll-course/:id', isAuth(), handler.get.enrollCourse)
router.get('/delete-course/:id', isAuth(), handler.get.deleteCourse)
router.get('/edit-course/:id', isAuth(), handler.get.editCourse)



//router.get('/offer-tripp', isAuth(), handler.get.offerTripp)
//router.get('/details-tripp/:id', isAuth(), handler.get.detailsTripp)
//router.get('/close-tripp/:id', isAuth(), handler.get.closeTripp)
//router.get('/join-tripp/:id', isAuth(), handler.get.joinTripp)







router.post('/create-course', isAuth(),  handler.post.createCourse)
router.post('/edit-course/:id', isAuth(),  handler.post.editCourse)






module.exports = router;
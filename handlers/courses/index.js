const User = require('../users/User')
const { validationResult } = require('express-validator');
const Course = require('./Course');
const { models } = require('mongoose');

module.exports = {
    get: {
        createCourse(req, res, next) {
            res.render('courses/create-course.hbs', {
                isLoggedIn: req.user !== undefined,
                username: req.user ? req.user.username : '',

            })
        },

        detailsCourse(req, res, next) {
            const { id } = req.params;

            Course
                .findById(id)
                .populate('usersEnrolled')
                .lean()
                .then((course) => {

                    const hbsOptions = Object.keys(course).reduce((acc, curr) => {
                        acc[curr] = course[curr]
                        return acc

                    }, {})

                    //console.log(hbsOptions)
                    const currentUser = JSON.stringify(req.user._id)
                    const imAlreadyIn = JSON.stringify(course.usersEnrolled).includes(currentUser)
                    res.render('courses/details-course', {
                        isLoggedIn: req.user !== undefined,
                        username: req.user ? req.user.username : '',
                        imAlreadyIn,
                        ...hbsOptions,
                        isTheCreator: JSON.stringify(req.user._id) === JSON.stringify(course.creator)

                    });

                })

        },
        enrollCourse(req, res, next) {
            const { id } = req.params;
            const { _id } = req.user._id;

            Promise.all([
                Course.updateOne({ _id: id }, { $push: { usersEnrolled: _id } }),
                User.updateOne({ _id }, { $push: { enrolledCourses: id } })

            ])
                .then(([updateTripp, updateUser]) => {
                    res.redirect(`/courses/details-course/${id}`)
                }).catch((err) => console.log(err))

        },
        deleteCourse(req, res, next) {
            const { id } = req.params;

            Course.deleteOne({ _id: id }).lean().then(() => {
                res.redirect('/home/')
            })


            // const { id } = req.params
            // const userId = req.user._id
            // Promise.all([

            //     Course.updateOne({ _id: id }), { $pull: { usersEnrolled: userId } },
            //     User.updateOne({ _id: userId }), { $pull: { enrolledCourses: id } }
            // ]).then(([updateCourse, updateUser]) => {

            //     res.redirect('/home/')
            // })

        },



        editCourse(req, res, next) {
            const { id } = req.params;

            Course.findById(id).then((course) => {
                const hbsObject = {
                    course,
                    isLoggedIn: req.user !== undefined
                };

                res.render('courses/edit-course.hbs', hbsObject);
            })

        }


    },
    post: {
        createCourse(req, res, next) {

            //console.log(req.body)
            const { title, description, imageUrl, isPublic: isChecked } = req.body
            const isPublic = isChecked === 'on' ? true : false
            const createdAt = (new Date() + '').slice(0, 24);
            const creator = req.user._id;

            Course.create({ title, description, imageUrl, isPublic, createdAt, creator })
                .then((createCourse) => {
                    console.log(createCourse);
                    res.status(201).redirect('/home/')
                })
            //     const [startPoint, endPoint] = directions.split(' - ')
            //     const [date, time] = dateTime.split(' - ')
            //     const { _id } = req.user

            //     const errors = validationResult(req)
            //     console.log(errors);

            //     if (!errors.isEmpty()) {
            //         return res.render('tripps/offer-tripp.hbs', {
            //             isLoggedIn: req.user !== undefined,
            //             userEmail: req.user ? req.user.email : '',
            //             message: errors.array()[0].msg,
            //             oldInput: { directions, dateTime, carImage, seats, description }
            //         })
            //     }

            //     Tripp.create({ startPoint, endPoint, date, time, carImage, seats, description, driver: _id }).then((createTripp) => {

            //         res.redirect('/tripp/shared-tripps')
            //     })

        },



        editCourse: (req, res, next) => {

            const { id } = req.params;
            const { title, description, imageUrl, isPublic } = req.body;
            const isChecked = isPublic === 'on';

            // const errors = validationResult(req);

            // if (!errors.isEmpty()) {
            //     return res.render('createCoursePage.hbs', {
            //         message: errors.array()[0].msg,
            //         oldInput: req.body
            //     })
            // }

            Course.findByIdAndUpdate(id, {title, description, imageUrl, isPublic: isChecked }).lean().then((updatedCourse) => {
                res.redirect('/home/');
            });
        }
    }

}

const User = require('../models/User');
const Job = require('../models/Job');
const bcrypt = require('bcrypt');
const { mongooseToObject, mutipleMongooseToObject } = require('../../util/mongoose');
const multiparty = require('multiparty');
const fs = require('fs');

class UserController {
    // [GET] user/login
    loginPage(req, res) {
        res.render('login', { title: 'Đăng nhập' });
    }

    // [POST] user/login
    login(req, res) {
        req.flash('success', 'Đăng nhập thành công');
        res.redirect('/');
    }

    // [POST] user/register
    register(req, res) {
        req.flash('success', 'Đăng ký thành công');
        res.redirect('/');
    }

    // [GET] user/login/facebook
    loginFb(req, res) {
        req.flash('success', 'Đăng nhập bằng facebook thành công');
        res.redirect('/');
    }

    // [GET] user/login/google
    loginGg(req, res) {
        req.flash('success', 'Đăng nhập bằng google thành công');
        res.redirect('/');
    }

    // [GET] user/profile
    profilePage(req, res) {
        User.findOne({ _id: req.user._id, status: true }, 'gender phone position website address about')
            .then((user_info) => {
                res.render('profile', { title: 'Trang cá nhân', user_info: mongooseToObject(user_info) });
            })
            .catch((error) => next(error));
    }

    // [POST] user/profile
    verify(req, res, next) {
        User.findOne({ _id: req.user._id, status: true })
            .then((user) => {
                if (!user.password) next();
                else if (bcrypt.compareSync(req.body.password, user.password)) next();
                else {
                    req.flash('message', 'Sai mật khẩu');
                    res.redirect(`/user/profile/${user._id}`);
                }
            })
            .catch((error) => next(error));
    }

    // [POST] user/profile
    updateProfile(req, res, next) {
        User.findOneAndUpdate(
            { _id: req.user._id, status: true },
            {
                name: req.body.name,
                gender: req.body.gender,
                phone: req.body.phone,
                position: req.body.position,
                website: req.body.website,
                address: req.body.address,
                about: req.body.about,
                password: req.body.new_password
                    ? bcrypt.hashSync(req.body.new_password, bcrypt.genSaltSync(8), null)
                    : bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8), null),
            },
            { new: true },
        )
            .then((user_info) => {
                req.flash('success', 'Cập nhật thông tin thành công');
                res.redirect(`/user/profile/${user_info._id}`);
            })
            .catch((error) => next(error));
    }

    //[POST] user/profile/upload-avatar
    updateAvatar(req, res, next) {
        const form = new multiparty.Form();
        const name = req.user._id.includes(':') ? req.user._id.split(':')[1] : req.user._id;
        form.parse(req, (err, fields, files) => {
            if (err) next(err);
            const sourceStream = fs.createReadStream(files.avatar[0].path);
            const destStream = fs.createWriteStream('public/img/avatar/' + name + '.jpg');
            sourceStream.pipe(destStream);

            sourceStream.on('end', function () {
                fs.unlinkSync(files.avatar[0].path);
            });
        });

        User.findOneAndUpdate(
            { _id: req.user._id, status: true },
            {
                img: '/img/avatar/' + name + '.jpg',
            },
            { new: true },
        )
            .then((user_info) => {
                req.flash('success', 'Cập nhật avatar thành công');
                res.redirect(`/user/profile/${user_info._id}`);
            })
            .catch((error) => next(error));
    }

    // [GET] user/bookmark
    bookmarkPage(req, res, next) {
        User.findOne({ _id: req.user._id, status: true }, 'bookmark')
            .then((user) => {
                Job.find({ _id: { $in: user.bookmark }, status: true }, 'name company place salary deadline')
                    .populate({
                        path: 'company',
                        select: 'name logo',
                    })
                    .then((jobs) => {
                        res.render('bookmark', {
                            title: 'Danh sách việc làm đã lưu',
                            bookmark: jobs.map((job) => {
                                return {
                                    _id: job._id,
                                    name: job.name,
                                    company: job.company
                                        ? {
                                              name: job.company.name,
                                              img: job.company.logo,
                                          }
                                        : '',
                                    place: job.getPlace(job.place),
                                    salary: job.salary,
                                    deadline: job.deadline,
                                };
                            }),
                        });
                    })
                    .catch((error) => next(error));
            })
            .catch((error) => next(error));
    }

    // [POST] user/bookmark/:id
    bookmark(req, res, next) {
        User.findOneAndUpdate(
            { _id: req.user._id, status: true },
            { $push: { bookmark: req.params.id } },
            { new: true },
        )
            .then(() => {
                res.status(201);
                res.redirect('/user/bookmark');
            })
            .catch((error) => next(error));
    }

    // [DELETE] user/bookmark/:id
    deleteBookmark(req, res, next) {
        User.findOneAndUpdate(
            { _id: req.user._id, status: true },
            { $pull: { bookmark: req.params.id } },
            { new: true },
        )
            .then(() => {
                res.status(201);
                res.redirect('/user/bookmark');
            })
            .catch((error) => next(error));
    }

    // [GET] user/logout
    logout(req, res, next) {
        req.logout(function (err) {
            if (err) {
                return next(err);
            }
            res.redirect('/user');
        });
    }
}

module.exports = new UserController();

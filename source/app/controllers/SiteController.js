const Job = require('../models/Job');
const { transporter, mailGenerator } = require('../../config/email');

class SiteController {
    // [GET] /index
    index(req, res, next) {
        Job.find({ status: true }, 'name company place salary deadline')
            .limit(3)
            .populate({
                path: 'company',
                select: 'name logo',
            })
            .then((jobs) => {
                res.render('index', {
                    title: 'Trang chủ',
                    jobs: jobs.map((job) => {
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
    }

    // [GET] /single_blog
    single_blog(req, res) {
        res.render('sing_blog', { title: 'Blog' });
    }

    // [GET] /company
    company(req, res) {
        res.render('company_detail', { title: 'Công ty' });
    }

    // [GET] /contact
    contactPage(req, res) {
        res.render('contact', { title: 'Liên hệ' });
    }

    // [POST] /contact
    contact(req, res, next) {
        const email = {
            body: {
                greeting: 'Tôi là',
                name: req.body.name,
                intro: ['Đây là địa chỉ email của tôi ' + req.body.email],
                outro: req.body.message.split(/\r?\n/),
                signature: false,
            },
        };

        const mail = mailGenerator.generate(email);
        const message = {
            from: {
                name: 'FindJobs Contact',
                address: 'thuhongkhanhtoan@gmail.com',
            },
            to: 'thuhongkhanhtoan@gmail.com',
            subject: req.body.subject,
            html: mail,
        };

        transporter
            .sendMail(message)
            .then(() => {
                req.flash('success', 'Liên hệ thành công');
                res.redirect('/contact');
            })
            .catch((error) => next(error));
    }

    // [POST] /news
    news(req, res, next) {
        const email = {
            body: {
                greeting: 'Xin chào',
                name: req.body.email,
                intro: 'Chào mừng bạn đến với FindJobs. Cảm ơn bạn đã theo dõi, chúng tôi sẽ gửi đến bạn thông tin được cập nhật nhanh nhất.',
                outro: 'Nếu bạn cần hỗ trợ, hoặc có câu hỏi? Hãy gửi email đến địa chỉ này, chúng tôi rất sẵn sàng hỗ trợ.',
                signature: 'Thân ái',
            },
        };

        const mail = mailGenerator.generate(email);
        const message = {
            from: {
                name: 'FindJobs',
                address: 'thuhongkhanhtoan@gmail.com',
            },
            to: req.body.email,
            subject: 'Cảm ơn bạn đã theo dõi',
            html: mail,
        };

        transporter
            .sendMail(message)
            .then(() => {
                req.flash('success', 'Đăng ký nhận tin tức thành công');
                res.redirect('/');
            })
            .catch((error) => next(error));
    }
}

module.exports = new SiteController();

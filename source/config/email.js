const nodeMailer = require('nodemailer');
const mailGen = require('mailgen');

// create reusable transporter object
const transporter = nodeMailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'thuhongkhanhtoan@gmail.com',
        pass: 'kcixfmyanhivjrpn',
    },
});

// configure mailgen by setting a theme and your product info
const mailGenerator = new mailGen({
    theme: 'default',
    product: {
        // appears in header & footer of e-mails
        name: 'FindJobs',
        link: 'http://localhost:3000/',
        // optional product logo
        logo: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh4x9F7M_pYvU3qTlh50EgFZAlT0ZpMidQ8KEdJC-tF2AF6hKEawLbiswtmE6oJlviA7YjsZ1LZVba8jYnnn6lCacuKC8Gsr8STbDE4u_ftFbloljp6EoLDxj0wR3AGC6zD1YQbkN3CZ5aEXePDhEpiWJVI9SKAlqqL8UoCiPAWqy_afySWJcIn_LYT-Q/s300/logo.png',
        // custom copyright notice
        copyright: 'Copyright © 2023 FindJobs. All rights reserved.',
    },
});

module.exports = { transporter, mailGenerator };

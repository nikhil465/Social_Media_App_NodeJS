const nodemailer = require('../config/nodemailer');

exports.resetPassword = (accessToken) => {
    let HTMLString = nodemailer.renderTemplate({ accessToken: accessToken }, '/reset_password/reset_password.ejs');

    nodemailer.transporter.sendMail({
        from: 'forwork98236886@gmail.com',
        to: accessToken.user.email,
        subject: 'Codial : Reset Password',
        html: HTMLString
    }, function (err, info) {
        if (err) {
            console.log('Error in sending mail', err);
            return;
        }

        console.log('Message send for reset password', info);
        return;
    })
}
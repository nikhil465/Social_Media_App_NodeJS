const nodemailer = require('../config/nodemailer');

// this is another way of exporting a method
exports.newComment = (comment) => {
    console.log('inside new comment mailer');
    let HTMLString = nodemailer.renderTemplate({ comment: comment }, '/comments/new_comment.ejs');

    nodemailer.transporter.sendMail({
        from: 'forwork98236886@gmail.com',
        to: comment.user.email,
        subject: "New comment Published!",
        html: HTMLString
    }, (err, info) => {
        if (err) {
            console.log('Error in sending mail', err);
            return;
        }

        // console.log('Message send', info);
        return;
    })
}
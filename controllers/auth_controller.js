const User = require('../models/user');
const AccessToken = require('../models/accessToken');
const crypto = require('crypto');
const resetPasswordMailer = require('../mailers/reset_password_mailer');

module.exports.auth = function (req, res) {
    return res.render('verify_email', {
        title: 'Codial | Verify Email'
    });
}

module.exports.verifyEmail = async function (req, res) {
    try {
        let user = await User.findOne({ email: req.body.email });

        if (user) {
            let token = await crypto.randomBytes(20).toString('hex');
            let accessToken = await AccessToken.create({
                user: user,
                token: token,
                isValid: true
            });

            accessToken = await accessToken.populate('user', 'name email');
            resetPasswordMailer.resetPassword(accessToken);

            return res.render('account_verified', {
                title: 'Codial | Account Verified'
            })
        }
    } catch (error) {
        console.log('Error in verifying email : ', error);
        return res.redirect('back');
    }
}

module.exports.resetPassword = async function (req, res) {
    try {
        let accessToken = await AccessToken.findOne({ token: req.query.accessToken });

        if (accessToken) {
            if (accessToken.isValid) {
                return res.render('reset_password', {
                    title: 'Codial | Reset Password',
                    accessToken: accessToken.token
                })
            }
        }
    } catch (error) {
        console.log('Error in reset Password  : ', error);
    }

    req.flash('error', 'Token is Expired ! Please regenerate it.');

    return res.redirect('/auth');
}

module.exports.reset = async function (req, res) {
    console.log('reset query , ', req.query);
    try {
        let accessToken = await AccessToken.findOne({ token: req.query.accessToken });
        if (accessToken) {
            if (accessToken.isValid) {
                accessToken.isValid = false;
                if (req.body.password == req.body.confirm_password) {
                    let user = await User.findById(accessToken.user);
                    if (user) {
                        console.log("Found User :", user);
                        user.password = req.body.password;
                        user.confirm_password = req.body.confirm_password;
                        accessToken.save();
                        user.save();
                        console.log('Password changed ', user);
                        req.flash('success', 'Password Changed!');
                        return res.redirect('/users/sign-in');

                    }
                } else {
                    request.flash('error', 'Password didnt matched');
                    return response.redirect('back');
                }
            }
        }
    } catch (error) {
        console.log('Error in resetting password : ', error);
    }

    request.flash('error', 'Token is Expired ! Pls regenerate it.');
    return response.redirect('/auth');
}
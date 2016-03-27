//
//	邮件发送模块
//
var fc = require('./func'),
	nodemailer = require('nodemailer'),
	transport  = require('nodemailer-smtp-transport');

var config = {
	name: process.env.EMAIL_NAME,
	email: process.env.EMAIL_EMAIL,
	username: process.env.EMAIL_USERNAME,
	password: process.env.EMAIL_PASSWORD
}

module.exports = {
	_transport: nodemailer.createTransport(transport({
		host: process.env.EMAIL_SMTP,
		port: process.env.EMAIL_PORT,
		secure: process.env.EMAIL_ENC,
		auth: {
			user: config['username'],
			pass: config['password']
		}
	})),
	send: function(opt, fn) {
		var _opt = {
			from: config['name'] + '<' + config['email'] + '>',
			to: opt.to,
			subject: opt.subject,
			html: opt.html
		};
		this._transport.sendMail(_opt, fn);
	}
}
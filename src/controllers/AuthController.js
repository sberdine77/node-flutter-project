const crypto = require("crypto");
const nodemailer = require("nodemailer");
const dotenv = require('dotenv/config');

module.exports = {
	async getToken(req, res) {
		const { sendTo } = req.query;
		console.log(`Here ${sendTo}`);
		const token = crypto.randomBytes(4).toString('HEX');

		// create reusable transporter object using the default SMTP transport
		let transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: process.env.GMAIL,
				pass: process.env.GMAIL_PASSWORD
			}
		});

		// send mail with defined transport object
		let info = await transporter.sendMail({
			from: "herokuflutterproject@gmail.com", // sender address
			to: sendTo, // list of receivers
			subject: "Flutter Project Token", // Subject line
			text: "Hello world?", // plain text body
			html: `
				<h1>Enter your token on your device to confirm your e-mail</h1>
				<br>
				<p>Your token: ${token}</p>
				`, // html body
		});

		console.log("Message sent: %s", info.messageId);
		// Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

		// Preview only available when sending through an Ethereal account
		console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
		return res.json({"Success": "success"});
	}
}
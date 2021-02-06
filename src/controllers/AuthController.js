const crypto = require("crypto");
const nodemailer = require("nodemailer");
const dotenv = require('dotenv/config');

module.exports = {
	async getToken(req, res, admin) {
		const { idToken } = req.body;
		var uid = "";
		var uemail = "";
		await admin
			.auth()
			.verifyIdToken(idToken)
			.then((decodedToken) => {
				uid = decodedToken.uid;
				uemail = decodedToken.email;
				// ...
			})
			.catch((error) => {
				console.log("Token validation error");
				console.log(error);
				return res.status(400).send({ error: 'Token validation error' });
				// Handle error
			});
		console.log("TEST");
		await admin
			.auth()
			.getUser(uid)
			.then((userRecord) => {
			  // See the UserRecord reference doc for the contents of userRecord.
			  console.log(`Successfully fetched user data: ${userRecord}`);
			})
			.catch((error) => {
			  console.log('Error fetching user data:', error);
			  return res.status(400).send({ error: 'Error fetching user data' });
			});

		const token = crypto.randomBytes(4).toString('HEX');

		//create reusable transporter object using the default SMTP transport
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
			to: uemail, // list of receivers
			subject: "Flutter Project Token", // Subject line
			text: "Hello world?", // plain text body
			html: `
				<h2>Enter this token on your device to confirm your e-mail</h2>
				<br>
				<p>Your token: ${token}</p>
				`, // html body
		});

		console.log("Message sent: %s", info.messageId);
		// Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

		// Preview only available when sending through an Ethereal account
		console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
		return res.json({"Message": "success"});
	},

	async checkToken(req, res) {
		const { token } = req.body;
	}
}
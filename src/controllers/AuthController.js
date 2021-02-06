const crypto = require("crypto");
const nodemailer = require("nodemailer");
const dotenv = require('dotenv/config');
const { timeStamp } = require("console");

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

		const tokensRef = admin.firestore().collection('tokens').doc(uid);
		const data = {
			token: `${token}`,
			timestamp: admin.firestore.FieldValue.serverTimestamp()
		}

		await tokensRef.set(data);

		return res.json({"Message": "success"});
	},

	async checkToken(req, res, admin) {
		const { emailToken, idToken } = req.body;

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
		
		const tokensRef = admin.firestore().collection('tokens').doc(uid);
		const tokenDoc = await tokensRef.get();

		if(!tokenDoc.exists) {
			console.log("Token expired or never sended to this user.");
			return res.status(400).send({ error: 'Token expired or never sended to this user.' });
		} else {
			console.log(`Success getting document`);

			try {
				if(tokenDoc.data()['token'] == emailToken) {
					console.log("Token validated!");
	
					//CHANGE USER ROLE
					const customClaims = {
						authorized_user: true
					}
					await admin.auth()
						.setCustomUserClaims(uid, customClaims)
						.then(async () => {
							const FieldValue =  admin.firestore.FieldValue;
							await tokensRef.update({
								token: FieldValue.delete()
							});
							await tokensRef.delete();
							return res.json({"Message": "success"});
						  })
						.catch(error => {
							console.log(`Error seting authorization claim ${error}`);
							return res.status(400).send({ error: `${error}` });
						});
				} else {
					console.log("Invalid token!");
					return res.status(400).send({ error: 'Invalid token!' });
				}
			} catch (error) {
				return res.status(400).send({ error: `${error}` });
			}
			
		}
	}
}
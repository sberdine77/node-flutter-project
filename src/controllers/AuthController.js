const crypto = require("crypto");

module.exports = {
	async getToken(req, res) {
		var tokenArray = new Uint8Array(6);
		window.crypto.getRandomValues(tokenArray);
		var token = "";
		for (var element in tokenArray) {
			token += element;
		}
	}
}
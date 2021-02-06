const router = require('express').Router();

const AuthController = require("../../controllers/AuthController");

var APIRoutes = function (passport, admin) {
	router.post('/sendToken', function(req, res) {
		console.log("TESTE HERE");
		AuthController.getToken(req, res, admin)
	});
	return router;
}
module.exports = APIRoutes;
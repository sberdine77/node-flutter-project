const router = require('express').Router();

const AuthController = require("../../controllers/AuthController");

var APIRoutes = function (passport, admin) {
	router.post('/sendToken', function(req, res) {
		AuthController.getToken(req, res, admin)
	});

	router.post('/checkToken', function(req, res) {
		AuthController.checkToken(req, res, admin)
	});
	return router;
}
module.exports = APIRoutes;
const router = require('express').Router();

const AuthController = require("../../controllers/AuthController");

var APIRoutes = function (passport) {
	router.get('/sendToken', AuthController.getToken);
	return router;
}
module.exports = APIRoutes;
const express = require('express');
const authControllers = require("../../controllers/users");
const { validateBody } = require("../../middlewares");
const { schemas } = require("../../helpers");
const { authenticate } = require("../../middlewares");

const router = express.Router();

router.post("/register", validateBody(schemas.authSchema), authControllers.register);

router.post("/login", validateBody(schemas.authSchema), authControllers.login);

router.get("/current", authenticate, authControllers.getCurrent);

router.post("/logout", authenticate, authControllers.logout);

module.exports = router;
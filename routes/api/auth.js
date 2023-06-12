const express = require('express');
const authControllers = require("../../controllers/users");
const { validateBody } = require("../../middlewares");
const { schemas } = require("../../helpers");
const { authenticate, upload } = require("../../middlewares");

const router = express.Router();

router.post("/register", validateBody(schemas.authSchema), authControllers.register);

router.get("/verify/:verificationToken", authControllers.verify);

router.post("/verify", validateBody(schemas.emailSchema), authControllers.resendVerification);

router.post("/login", validateBody(schemas.authSchema), authControllers.login);

router.get("/current", authenticate, authControllers.getCurrent);

router.post("/logout", authenticate, authControllers.logout);

router.patch("/avatars", authenticate, upload.single("avatarURL"), authControllers.updateAvatar);


module.exports = router;
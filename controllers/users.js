const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const User = require("../models/user");
const { HttpError, sendEmail } = require("../helpers");
const ctrlWrapper = require("../decorators/ctrlWrapper");
const fs = require("fs/promises");
const path = require("path");
const Jimp = require("jimp");
const { nanoid } = require("nanoid");

const SECRET_KEY = "Q5f2aK6Eosoll4co56U3HAxu0mrk8TxL";

const avatarPath = path.resolve("public", "avatars");

const PROJECT_URL = "http://localhost:3000";

const register = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
        throw new HttpError(409, "Email in use");
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const verificationToken = nanoid();

    const avatarURL = gravatar.url(email);
    const result = await User.create({ ...req.body, avatarURL, password: hashPassword, verificationToken });

    const verifyEmail = {
        to: email,
        subject: "Please, verify email",
        html: `<a target="_blank" href="${PROJECT_URL}/api/users/verify/${verificationToken}">Please, click to verify email</a>`
    };

    await sendEmail(verifyEmail);
  
    res.status(201).json({
        email: result.email,
        subscription: result.subscription
    })
};


const verify = async (req, res) => {
    const { verificationToken } = req.params;
    const user = await User.findOne({ verificationToken });
    if (!user) {
        throw new HttpError(404, 'User not found');
    };
    await User.findByIdAndUpdate(user._id, { verify: true, verificationToken: "" });
    
    console.log(verificationToken)
    res.json({
        message: "Verification successful"
    })
};


const resendVerification = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if(!user) {
throw new HttpError(404, 'User not found');
    };
    if(user.verify) {
        throw new HttpError(400, 'Verification has already been passed');
    };
    
      const verifyEmail = {
        to: email,
        subject: "Please, verify email",
        html: `<a target="_blank" href="${PROJECT_URL}/api/users/verify/${user.verificationToken}">Please, click to verify email</a>`
    };

    await sendEmail(verifyEmail);

    res.json({
        message: "Verification email sent"
    })
}

const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        throw new HttpError(401, "Email or password is wrong");
    }

    if (!user.verify) {
        throw new HttpError(401, "Email is not verified");
    };

    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
        throw new HttpError(401, "Email or password is wrong");
    }

    const { _id: id } = user;

    const payload = {
        id,
    }

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
    await User.findByIdAndUpdate(id, { token });

    res.json({
        token: token,
        user: {
            email: user.email,
            subscription: user.subscription
        }
    })
};

const getCurrent = async(req, res)=> {
    const {email, subscription} = req.user;
const user = await User.findOne({ email });
    if (!user) {
        throw new HttpError(401, "Not authorized");
    };

    res.json({
        email,
        subscription,
    })
}

const logout = async(req, res)=> {
    const {_id} = req.user;
    const user = await User.findOne({ _id });
    if (!user) {
        throw new HttpError(401, "Not authorized");
    };

    await User.findByIdAndUpdate(_id, {token: ""});

    res.status(204).json("No Content")
}

const updateAvatar = async (req, res) => {
    const {_id} = req.user;
    const { path: oldPath, originalname } = req.file;

    const image = await Jimp.read(oldPath);
    await image.resize(250, 250).writeAsync(oldPath);

    const filename = `${_id}_${originalname}`;
    const newPath = path.join(avatarPath, filename);
    await fs.rename(oldPath, newPath);
    const avatarURL = path.join("avatars", filename);
    await User.findByIdAndUpdate(_id, {avatarURL});

    res.json({
        avatarURL,
    })
}

module.exports = {
    register: ctrlWrapper(register),
    verify: ctrlWrapper(verify),
    resendVerification: ctrlWrapper(resendVerification),
    login: ctrlWrapper(login),
    getCurrent: ctrlWrapper(getCurrent),
    logout: ctrlWrapper(logout),
    updateAvatar: ctrlWrapper(updateAvatar)
}
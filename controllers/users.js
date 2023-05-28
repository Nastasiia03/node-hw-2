const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const { HttpError } = require("../helpers");
const ctrlWrapper = require("../decorators/ctrlWrapper");

const SECRET_KEY = "Q5f2aK6Eosoll4co56U3HAxu0mrk8TxL";

const register = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
        throw new HttpError(409, "Email in use");
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const result = await User.create({ ...req.body, password: hashPassword });

    res.status(201).json({
        email: result.email,
        subscription: result.subscription
    })
};

const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        throw new HttpError(401, "Email or password is wrong");
    }

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

module.exports = {
    register: ctrlWrapper(register),
    login: ctrlWrapper(login),
    getCurrent: ctrlWrapper(getCurrent),
    logout: ctrlWrapper(logout),
}
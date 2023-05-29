const Joi = require("joi");

const contactAddSchema = Joi.object({
    name: Joi.string().min(2).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().pattern(/^(\s*)?(\+)?([- _():=+]?\d[- _():=+]?){10,14}(\s*)?$/).required()
});


const updateFavoriteSchema = Joi.object({
favorite: Joi.boolean().required(),
});

const authSchema = Joi.object({
    password: Joi.string().min(6).required(),
    email: Joi.string().email().required(),
})
const schemas = { contactAddSchema, updateFavoriteSchema, authSchema };

module.exports = schemas;
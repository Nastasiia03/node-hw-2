const express = require('express')
const Joi = require("joi");

const contactsService = require("../../models/contacts");
const { HttpError } = require("../../helpers"); 

const router = express.Router()

const contactAddSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
phone: Joi.string().required()
})

router.get('/', async (req, res, next) => {
  try {
    const result = await contactsService.listContacts();
    res.json(result)
  }
  catch (error) {
    next(error);
  }
})

router.get('/:contactId', async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await contactsService.getContactById(contactId);
    if (!result) {
      throw HttpError(404, `Contact with ${contactId} not found`);
    }
    res.json(result);
  }
  catch (error) {
    next(error);
  }
})

router.post('/', async (req, res, next) => {
  try {
    const { error } = contactAddSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
    // const { name, email, phone } = req.body;
    const result = contactsService.addContact(req.body);
    res.status(201).json(result);
    console.log(req.body)
  }
  catch (error) {
    next(error);
  }
})

router.delete('/:contactId', async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await contactsService.removeContact(contactId);
    if (!result) {
      throw HttpError(404, `Contact with ${contactId} not found`);
    }
    res.json({
      message: "Delete success"
    })
  } 
  catch (error) {
    next(error);
  }
})

router.put('/:contactId', async (req, res, next) => {
  try {
     const { error } = contactAddSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }
  }
  catch (error) {
    next(error);
  }
})

module.exports = router

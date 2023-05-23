const Contact = require("../models/contact");

const { HttpError, contactAddSchema, updateFavoriteSchema } = require("../helpers");

const ctrlWrapper = require("../decorators/ctrlWrapper");


const getAllContacts = async (req, res) => {
    const result = await Contact.find();
    res.json(result);
}

const getContactById = async (req, res, next) => {
    const { contactId } = req.params;
    const result = await Contact.findById(contactId);
    if (!result) {
      throw new HttpError(404, "Not found");
    }
  res.json(result);
}

  const addContact = async (req, res, next) => {
      const { error } = contactAddSchema.validate(req.body);
      if (error) {
        throw new HttpError(400, error.message);
      }
      const result = await Contact.create(req.body);
      res.status(201).json(result);
    }; 

const removeContact = async (req, res, next) => {
  const { contactId } = req.params;
  const result = await Contact.findByIdAndRemove(contactId);
  if (!result) {
    throw new HttpError(404, "Not found");
  }
  res.json({
    message: "Contact deleted"
  })
};

const updateContact = async (req, res, next) => {
  const { error } = contactAddSchema.validate(req.body);
  if (error) {
    throw new HttpError(400, error.message);
  }
  const { contactId } = req.params;
  const result = await Contact.findByIdAndUpdate(contactId, req.body, { new: true });
  if (!result) {
    throw new HttpError(404, "Not found");
  }
  res.json(result);
};

const updateStatusContact = async (req, res, next) => {
  const { error } = updateFavoriteSchema.validate(req.body);
  if (error) {
    throw new HttpError(400, error.message);
  }
  const { contactId } = req.params;
  const result = await Contact.findByIdAndUpdate(contactId, req.body, { new: true });
  if (!result) {
    throw new HttpError(404, "Not found");
  }
  res.json(result);
};
  
module.exports = {
getAllContacts: ctrlWrapper(getAllContacts),
  getContactById: ctrlWrapper(getContactById),
  addContact: ctrlWrapper(addContact),
  removeContact: ctrlWrapper(removeContact),
  updateContact: ctrlWrapper(updateContact),
updateStatusContact: ctrlWrapper(updateStatusContact)
};
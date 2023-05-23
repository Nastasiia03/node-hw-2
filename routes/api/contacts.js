const express = require('express');
const contactsService = require("../../controllers/contacts");
const isValidId = require("../../middlewares/isValidId");
const router = express.Router();



router.get('/', contactsService.getAllContacts);

router.get('/:contactId', isValidId, contactsService.getContactById);

router.post('/', contactsService.addContact);

router.delete('/:contactId', isValidId, contactsService.removeContact);

router.put('/:contactId', isValidId, contactsService.updateContact);

router.patch('/:contactId/favorite', isValidId, contactsService.updateStatusContact);

module.exports = router;

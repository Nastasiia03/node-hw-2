const express = require('express');
const contactsService = require("../../controllers/contacts");
const { validateBody } = require("../../middlewares");
const { isValidId, authenticate} = require("../../middlewares");
const { schemas } = require("../../helpers");
const router = express.Router();

router.use(authenticate);

router.get('/', contactsService.getAllContacts);

router.get('/:contactId', isValidId, contactsService.getContactById);

router.post('/', validateBody(schemas.contactAddSchema), contactsService.addContact);

router.delete('/:contactId', isValidId, contactsService.removeContact);

router.put('/:contactId', validateBody(schemas.contactAddSchema), isValidId, contactsService.updateContact);

router.patch('/:contactId/favorite', validateBody(schemas.updateFavoriteSchema), isValidId, contactsService.updateStatusContact);

module.exports = router;

const { HttpError } = require("../helpers");

const contacts = require("../services/contactsServices");
const contactValidationSchema = require("../helpers/joiValidation/contactsValidation");
const { Contact } = require("../models/contactsModel");

const getList = async (req, res, next) => {
  const result = await Contact.find();
  res.json(result);
};

const getContactById = async (req, res, next) => {
  const id = req.params.id;
  const result = await contacts.getContactById(id);

  if (!result) {
    throw HttpError(404, "CONTACT NOT FOUND 🤷‍♂️");
  }
  res.json(result);
};

const addContact = async (req, res, next) => {
  const { error } = contactValidationSchema.validate(req.body);
  if (error) {
    throw HttpError(400, error.message);
  }

  const result = await contacts.addContact(req.body);
  res.status(201).json(result);
};

const updateContact = async (req, res, next) => {
  const { error } = contactValidationSchema.validate(req.body);
  if (error) {
    throw HttpError(400, error.message);
  }

  const { id } = req.params;
  const result = await contacts.updateContact(id, req.body);
  if (!result) {
    throw HttpError(404, "CONTACT NOT FOUND 🤷‍♂️");
  }
  res.json(result);
};

const removeContact = async (req, res, next) => {
  const { id } = req.params;
  const result = await contacts.removeContact(id);
  if (!result) {
    throw HttpError(404, "CONTACT NOT FOUND 🤷‍♂️");
  }
  res.json(result);
};
module.exports = {
  getList,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};

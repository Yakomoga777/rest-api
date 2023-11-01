const Joi = require("joi");

const contactValidationSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string()
    .regex(/^\(\d{3}\)-\d{3}-\d{4}$/)
    .required(),
});

module.exports = contactValidationSchema;

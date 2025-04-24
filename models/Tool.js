// models/Tool.js
const mongoose = require('mongoose');
const Joi = require('joi');

// Mongoose schema for a Tool document
const toolSchema = new mongoose.Schema({
  name:        { type: String, required: true, minlength: 3 },
  price:       { type: Number, required: true, min: 0 },
  brand:       { type: String, required: true, minlength: 2 },
  description: { type: String, required: true, minlength: 5 },
  img_name:    { type: String, required: true }
});

// Joi schema for request validation (reuse in your routes)
toolSchema.statics.validateTool = (data) => {
  const schema = Joi.object({
    name:        Joi.string().min(3).required(),
    price:       Joi.number().min(0).required(),
    brand:       Joi.string().min(2).required(),
    description: Joi.string().min(5).required(),
    img_name:    Joi.string().required()
  });
  return schema.validate(data, { abortEarly: false });
};

const Tool = mongoose.model('Tool', toolSchema);
module.exports = Tool;

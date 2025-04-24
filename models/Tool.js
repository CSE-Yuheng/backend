// models/Tool.js
const mongoose = require('mongoose');
const Joi     = require('joi');

const toolSchema = new mongoose.Schema({
  name:        { type: String, required: true, minlength: 3 },
  price:       { type: Number, required: true, min: 0 },
  brand:       { type: String, required: true, minlength: 2 },
  description: { type: String, required: true, minlength: 5 },
  img_name:    { type: String, required: true }
});

// static for Joi validation
toolSchema.statics.validateTool = function(data) {
  const schema = Joi.object({
    name:        Joi.string().min(3).required(),
    price:       Joi.number().min(0).required(),
    brand:       Joi.string().min(2).required(),
    description: Joi.string().min(5).required(),
    img_name:    Joi.string().required()
  });
  return schema.validate(data, { abortEarly: false });
};

module.exports = mongoose.model('Tool', toolSchema);

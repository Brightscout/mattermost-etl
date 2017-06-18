const Joi = require('joi');
const validate = require('../validate');

//
// Define the schema
//
const schema = {
  name: Joi.string(),
  display_name: Joi.string(),
  description: Joi.string(),
  type: Joi.string().valid('O', 'I'),
  allow_open_invite: Joi.boolean()
};

//
// Generate a valid object
//
module.exports = function (props) {
  return {
    type: 'team',
    team: validate(schema, props)
  };
}

const Joi = require('joi')
const validate = require('./validate')

//
// Define the schema
//
const schema = {
  team: Joi.string(),
  channel: Joi.string(),
  user: Joi.string(),
  message: Joi.string(),
  create_at: Joi.number()
}

//
// Generate a valid object
//
module.exports = function (props) {
  return {
    type: 'post',
    post: validate(schema, props)
  }
}

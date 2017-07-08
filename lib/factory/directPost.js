const Joi = require('joi')
const validate = require('./validate')

//
// Define the schema
//
const schema = {
  channel_members: Joi.array().items(Joi.string()).min(2),
  user: Joi.string(),
  message: Joi.string(),
  create_at: Joi.number()
}

//
// Generate a valid object
//
module.exports = function (props) {
  return {
    type: 'direct_post',
    direct_post: validate(schema, props)
  }
}

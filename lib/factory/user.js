const Joi = require('joi')
const validate = require('./validate')

//
// Define the schema
//
const schema = {
  username: Joi.string(),
  email: Joi.string().email({
    errorLevel: true,
    minDomainAtoms: 2
  }),
  auth_service: Joi.string().valid(
    'gitlab',
    'ldap',
    'saml',
    'google',
    'office365'
  ).optional(),
  auth_data: Joi.string().optional(),
  password: Joi.string().optional(),
  nickname: Joi.string().optional(),
  first_name: Joi.string().optional(),
  last_name: Joi.string().optional(),
  position: Joi.string().optional(),
  roles: Joi.string().optional().valid(
    'system_user',
    'system_admin system_user'
  ),
  teams: Joi.array().items(
    Joi.object({
      name: Joi.string(),
      roles: Joi.string().optional().valid(
        'team_user',
        'team_admin team_user'
      ),
      channels: Joi.array().items(
        Joi.object({
          name: Joi.string(),
          roles: Joi.string().optional().valid(
            'channel_user',
            'channel_user channel_admin'
          )
        })
      )
    })
  )
}

//
// Generate a valid object
//
module.exports = function (props) {
  return {
    type: 'user',
    user: validate(schema, props)
  }
}

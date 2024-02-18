const Joi = require('joi');
const { number } = require('joi');

module.exports.postSchema = Joi.object({
    post: Joi.object({
      username: Joi.string().required(),
      location: Joi.string().required(),
      description: Joi.string().required(),
      url: Joi.string()
    }).required()
  })

  module.exports.commentSchema = Joi.object({
    comment: Joi.object({
      body: Joi.string().required()
    }).required()
  })
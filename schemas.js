const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension)

module.exports.postSchema = Joi.object({
    post: Joi.object({
      username: Joi.string().escapeHTML(),
      location: Joi.string().required().escapeHTML(),
      description: Joi.string().required().escapeHTML()
    }).required(),
    deleteImages: Joi.array()
  })

  module.exports.commentSchema = Joi.object({
    comment: Joi.object({
      body: Joi.string().required()
    }).required()
  })
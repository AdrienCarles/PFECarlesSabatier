const Joi = require('joi');
const { commonSchema, buildParamsSchema } = require('./commonSchema');

const serieSchema = {
    create: Joi.object({
        SES_titre: commonSchema.maxLength50.required()
            .messages({
                ...commonSchema.messages.maxLength,
                'any.required': 'Le titre est requis'
            }),
        SES_theme: commonSchema.maxLength50
            .messages(commonSchema.messages.maxLength),
        SES_description: commonSchema.maxLength255
            .messages(commonSchema.messages.maxLength),
        SES_statut: commonSchema.activeStatus
            .messages(commonSchema.messages.status)
    }),

    params: Joi.object(buildParamsSchema('ses')),

    query: Joi.object({
        titre: commonSchema.maxLength50,
        theme: commonSchema.maxLength50,
        statut: commonSchema.activeStatus,
        page: Joi.number().integer().min(1),
        limit: Joi.number().integer().min(1).max(100)
    })
};

module.exports = serieSchema;
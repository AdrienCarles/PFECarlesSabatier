const Joi = require('joi');
const { commonSchema, buildParamsSchema } = require('./commonSchema');

const accesSchema = {
    create: Joi.object({
        USR_id: commonSchema.id
            .messages(commonSchema.messages.id),
        SES_id: commonSchema.id
            .messages(commonSchema.messages.id)
    }),

    params: Joi.object({
        usrId: commonSchema.id
            .messages({
                'number.base': 'L\'ID utilisateur doit être un nombre',
                'any.required': 'L\'ID utilisateur est requis'
            }),
        sesId: commonSchema.id
            .messages({
                'number.base': 'L\'ID de la série doit être un nombre',
                'any.required': 'L\'ID de la série est requis'
            })
    }),

    userParams: Joi.object(buildParamsSchema('usr')),

    query: Joi.object({
        page: Joi.number().integer().min(1),
        limit: Joi.number().integer().min(1).max(100)
    })
};

module.exports = accesSchema;
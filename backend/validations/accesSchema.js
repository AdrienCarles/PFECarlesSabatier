const Joi = require('joi');

const accesSchema = {
    create: Joi.object({
        USR_id: Joi.number().integer().required()
            .messages({
                'number.base': 'L\'ID utilisateur doit être un nombre',
                'any.required': 'L\'ID utilisateur est requis'
            }),
        SES_id: Joi.number().integer().required()
            .messages({
                'number.base': 'L\'ID de la série doit être un nombre',
                'any.required': 'L\'ID de la série est requis'
            })
    }),

    params: Joi.object({
        usrId: Joi.number().integer().required()
            .messages({
                'number.base': 'L\'ID utilisateur doit être un nombre',
                'any.required': 'L\'ID utilisateur est requis'
            }),
        sesId: Joi.number().integer().required()
            .messages({
                'number.base': 'L\'ID de la série doit être un nombre',
                'any.required': 'L\'ID de la série est requis'
            })
    }),

    userParams: Joi.object({
        usrId: Joi.number().integer().required()
            .messages({
                'number.base': 'L\'ID utilisateur doit être un nombre',
                'any.required': 'L\'ID utilisateur est requis'
            })
    })
};

module.exports = accesSchema;
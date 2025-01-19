const Joi = require('joi');

const paiementSchema = {
    create: Joi.object({
        PAI_type: Joi.string().valid('carte', 'paypal').required()
            .messages({
                'any.only': 'Le type de paiement doit être carte ou paypal',
                'any.required': 'Le type de paiement est requis'
            }),
        PAI_montant: Joi.number().positive().required()
            .messages({
                'number.positive': 'Le montant doit être positif',
                'any.required': 'Le montant est requis'
            }),
        PAI_date: Joi.date().required()
            .messages({
                'date.base': 'La date doit être valide',
                'any.required': 'La date est requise'
            })
    }),

    params: Joi.object({
        paiId: Joi.number().integer().required()
            .messages({
                'number.base': 'L\'ID du paiement doit être un nombre',
                'any.required': 'L\'ID du paiement est requis'
            })
    }),
};

module.exports = paiementSchema;
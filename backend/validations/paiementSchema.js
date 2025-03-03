import Joi from 'joi';
import { commonSchema, buildParamsSchema } from './commonSchema.js';

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
        PAI_date: commonSchema.requiredDate
            .messages(commonSchema.messages.date)
    }),

    params: Joi.object(buildParamsSchema('pai')),

    query: Joi.object({
        type: Joi.string().valid('carte', 'paypal'),
        dateDebut: commonSchema.date,
        dateFin: commonSchema.date,
        montantMin: Joi.number().positive(),
        montantMax: Joi.number().positive(),
        page: Joi.number().integer().min(1),
        limit: Joi.number().integer().min(1).max(100)
    })
};

export default paiementSchema;
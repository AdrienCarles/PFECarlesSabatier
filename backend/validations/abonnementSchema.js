const Joi = require('joi');
const { commonSchema, buildParamsSchema } = require('./commonSchema');

const abonnementSchema = {
    create: Joi.object({
        USR_id: commonSchema.id
            .messages(commonSchema.messages.id),
        ABM_dateDebut: commonSchema.requiredDate
            .messages(commonSchema.messages.date),
        ABM_dateFin: Joi.date().greater(Joi.ref('ABM_dateDebut')).required()
            .messages({
                'date.greater': 'La date de fin doit être postérieure à la date de début',
                'any.required': 'La date de fin est requise'
            }),
        ABM_prix: Joi.number().positive().required()
            .messages({
                'number.positive': 'Le prix doit être positif',
                'any.required': 'Le prix est requis'
            }),
        ABM_statut: Joi.string().valid('actif', 'inactif', 'suspendu').required()
            .messages({
                'any.only': 'Le statut doit être actif, inactif ou suspendu',
                'any.required': 'Le statut est requis'
            })
    }),

    params: Joi.object(buildParamsSchema('abm')),
    userParams: Joi.object(buildParamsSchema('usr')),

    query: Joi.object({
        statut: Joi.string().valid('actif', 'inactif', 'suspendu'),
        dateDebut: commonSchema.date,
        dateFin: commonSchema.date,
        page: Joi.number().integer().min(1),
        limit: Joi.number().integer().min(1).max(100)
    })
};

module.exports = abonnementSchema;
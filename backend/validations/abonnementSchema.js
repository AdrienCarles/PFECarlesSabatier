const Joi = require('joi');

const abonnementSchema = {
    create: Joi.object({
        USR_id: Joi.number().integer().required()
            .messages({
                'number.base': 'L\'ID utilisateur doit être un nombre',
                'any.required': 'L\'ID utilisateur est requis'
            }),
        ABM_dateDebut: Joi.date().required()
            .messages({
                'date.base': 'La date de début doit être une date valide',
                'any.required': 'La date de début est requise'
            }),
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
            }),
    }),

    params: Joi.object({
        abmId: Joi.number().integer().required().messages({
            'number.base': "L'ID de l'abonnement doit être un nombre entier",
            'any.required': "L'ID de l'abonnement est requis",
        }),
    }),

    userParams: Joi.object({
        usrId: Joi.number().integer().required()
            .messages({
                'number.base': "L'ID de l'utilisateur doit être un nombre entier",
                'any.required': "L'ID de l'utilisateur est requis"
            })
    })
};

module.exports = abonnementSchema;
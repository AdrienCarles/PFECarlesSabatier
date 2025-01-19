const Joi = require('joi');

const enfantSchema = {
    create: Joi.object({
        ENFA_prenom: Joi.string().max(50).required()
            .messages({
                'string.max': 'Le prénom ne peut pas dépasser 50 caractères',
                'any.required': 'Le prénom est requis'
            }),
        ENFA_nom: Joi.string().max(50).required()
            .messages({
                'string.max': 'Le nom ne peut pas dépasser 50 caractères',
                'any.required': 'Le nom est requis'
            }),
        ENFA_dateNaissance: Joi.date().required()
            .messages({
                'date.base': 'La date de naissance doit être une date valide',
                'any.required': 'La date de naissance est requise'
            }),
        ENFA_niveauAudition: Joi.string().max(50),
        ENFA_dateDebutSuivi: Joi.date()
            .messages({
                'date.base': 'La date de début de suivi doit être une date valide',
            }),
        ENFA_dateFinSuivi: Joi.date()
            .messages({
                'date.base': 'La date de fin de suivi doit être une date valide',
            }),
        USR_parent_id: Joi.number().integer().required()
            .messages({
                'number.base': 'L\'ID du parent doit être un nombre',
                'any.required': 'L\'ID du parent est requis'
            }),
        USR_orthophoniste_id: Joi.number().integer().required()
            .messages({
                'number.base': 'L\'ID de l\'orthophoniste doit être un nombre',
                'any.required': 'L\'ID de l\'orthophoniste est requis'
            }),
    }).custom((value, helpers) => {
        if (value.ENFA_dateDebutSuivi && value.ENFA_dateFinSuivi &&
            value.ENFA_dateDebutSuivi > value.ENFA_dateFinSuivi) {
            return helpers.error('custom.dates', 'La date de début doit être antérieure à la date de fin');
        }
        return value;
    }),

    update: Joi.object({
        ENFA_nom: Joi.string().max(50),
        ENFA_prenom: Joi.string().max(50),
        ENFA_dateNaissance: Joi.date(),
        ENFA_niveauAudition: Joi.string().max(50),
        ENFA_dateDebutSuivi: Joi.date(),
        ENFA_dateFinSuivi: Joi.date(),
        USR_parent_id: Joi.number().integer(),
        USR_orthophoniste_id: Joi.number().integer()
    }).custom((value, helpers) => {
        if (value.ENFA_dateDebutSuivi && value.ENFA_dateFinSuivi &&
            value.ENFA_dateDebutSuivi > value.ENFA_dateFinSuivi) {
            return helpers.error('custom.dates', 'La date de début doit être antérieure à la date de fin');
        }
        return value;
    }),

    params: Joi.object({
        enfaId: Joi.number().integer().required()
            .messages({
                'number.base': "L'ID de l'enfant doit être un nombre",
                'any.required': "L'ID de l'enfant est requis"
            })
    }),

    userParams: Joi.object({
        usrId: Joi.number().integer().required()
            .messages({
                'number.base': "L'ID de l'utilisateur doit être un nombre",
                'any.required': "L'ID de l'utilisateur est requis"
            })
    })
};

module.exports = enfantSchema;
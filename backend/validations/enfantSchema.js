const Joi = require('joi');
const { commonSchema, buildParamsSchema } = require('./commonSchema');

const enfantSchema = {
    create: Joi.object({
        ENFA_prenom: commonSchema.maxLength50.required()
            .messages({
                ...commonSchema.messages.maxLength,
                'any.required': 'Le prénom est requis'
            }),
        ENFA_nom: commonSchema.maxLength50.required()
            .messages({
                ...commonSchema.messages.maxLength,
                'any.required': 'Le nom est requis'
            }),
        ENFA_dateNaissance: commonSchema.requiredDate
            .messages(commonSchema.messages.date),
        ENFA_niveauAudition: commonSchema.maxLength50,
        ENFA_dateDebutSuivi: commonSchema.date
            .messages(commonSchema.messages.date),
        ENFA_dateFinSuivi: commonSchema.date
            .messages(commonSchema.messages.date),
        USR_parent_id: commonSchema.id
            .messages(commonSchema.messages.id),
        USR_orthophoniste_id: commonSchema.id
            .messages(commonSchema.messages.id)
    }).custom((value, helpers) => {
        if (value.ENFA_dateDebutSuivi && value.ENFA_dateFinSuivi &&
            value.ENFA_dateDebutSuivi > value.ENFA_dateFinSuivi) {
            return helpers.error('custom.dates', 'La date de début doit être antérieure à la date de fin');
        }
        return value;
    }),

    update: Joi.object({
        ENFA_nom: commonSchema.maxLength50,
        ENFA_prenom: commonSchema.maxLength50,
        ENFA_dateNaissance: commonSchema.date,
        ENFA_niveauAudition: commonSchema.maxLength50,
        ENFA_dateDebutSuivi: commonSchema.date,
        ENFA_dateFinSuivi: commonSchema.date,
        USR_parent_id: commonSchema.id,
        USR_orthophoniste_id: commonSchema.id
    }).custom((value, helpers) => {
        if (value.ENFA_dateDebutSuivi && value.ENFA_dateFinSuivi &&
            value.ENFA_dateDebutSuivi > value.ENFA_dateFinSuivi) {
            return helpers.error('custom.dates', 'La date de début doit être antérieure à la date de fin');
        }
        return value;
    }),

    params: Joi.object(buildParamsSchema('enfa')),
    userParams: Joi.object(buildParamsSchema('usr'))
};

module.exports = enfantSchema;
const Joi = require('joi');

const serieSchema = Joi.object({
    SES_titre: Joi.string().max(50).required()
        .messages({
            'string.max': 'Le titre ne peut pas dépasser 50 caractères',
            'any.required': 'Le titre est requis'
        }),
    SES_theme: Joi.string().max(50)
        .messages({
            'string.max': 'Le thème ne peut pas dépasser 50 caractères'
        }),
    SES_description: Joi.string().max(255)
        .messages({
            'string.max': 'La description ne peut pas dépasser 255 caractères'
        }),
    SES_statut: Joi.string().valid('actif', 'inactif').required()
        .messages({
            'any.only': 'Le statut doit être actif ou inactif',
            'any.required': 'Le statut est requis'
        })
});

module.exports = serieSchema;
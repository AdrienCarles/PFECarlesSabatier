const Joi = require('joi');

const enfantSchema = Joi.object({
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
    USR_parent_id: Joi.number().integer().required()
        .messages({
            'number.base': 'L\'ID du parent doit être un nombre',
            'any.required': 'L\'ID du parent est requis'
        }),
    USR_orthophoniste_id: Joi.number().integer().required()
        .messages({
            'number.base': 'L\'ID de l\'orthophoniste doit être un nombre',
            'any.required': 'L\'ID de l\'orthophoniste est requis'
        })
});

module.exports = enfantSchema;
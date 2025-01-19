const Joi = require('joi');

const animationSchema = Joi.object({
    ANI_titre: Joi.string().max(50).required()
        .messages({
            'string.max': 'Le titre ne peut pas dépasser 50 caractères',
            'any.required': 'Le titre est requis'
        }),
    ANI_urlAnimation: Joi.string().uri().required()
        .messages({
            'string.uri': 'L\'URL de l\'animation doit être valide',
            'any.required': 'L\'URL de l\'animation est requise'
        }),
    ANI_urlAudio: Joi.string().uri()
        .messages({
            'string.uri': 'L\'URL audio doit être valide'
        }),
    ANI_type: Joi.string().valid('dessin', 'réel').required()
        .messages({
            'any.only': 'Le type doit être dessin ou réel',
            'any.required': 'Le type est requis'
        }),
    SES_id: Joi.number().integer().required()
        .messages({
            'number.base': 'L\'ID de la série doit être un nombre',
            'any.required': 'L\'ID de la série est requis'
        }),
    USR_creator_id: Joi.number().integer().required()
        .messages({
            'number.base': 'L\'ID du créateur doit être un nombre',
            'any.required': 'L\'ID du créateur est requis'
        }),
    ANI_duree: Joi.number().positive()
        .messages({
            'number.positive': 'La durée doit être positive'
        })
});

module.exports = animationSchema;
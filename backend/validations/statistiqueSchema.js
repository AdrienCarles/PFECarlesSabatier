const Joi = require('joi');

const statistiqueSchema = Joi.object({
    ENFA_id: Joi.number().integer().required()
        .messages({
            'number.base': 'L\'ID de l\'enfant doit être un nombre',
            'any.required': 'L\'ID de l\'enfant est requis'
        }),
    SES_id: Joi.number().integer().required()
        .messages({
            'number.base': 'L\'ID de la série doit être un nombre',
            'any.required': 'L\'ID de la série est requis'
        }),
    STAT_tempUtil: Joi.string().pattern(/^([0-9]{1,2}):([0-5][0-9]):([0-5][0-9])$/)
        .messages({
            'string.pattern.base': 'Le temps d\'utilisation doit être au format HH:mm:ss'
        }),
    STAT_dernierAcces: Joi.date()
        .messages({
            'date.base': 'La date du dernier accès doit être valide'
        })
});

module.exports = statistiqueSchema;
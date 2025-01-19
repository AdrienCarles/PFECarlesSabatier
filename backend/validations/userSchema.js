const Joi = require('joi');
const { commonSchema, buildParamsSchema } = require('./commonSchema');

const userSchema = {
    create: Joi.object({
        USR_email: Joi.string().email().required()
            .messages({
                'string.email': 'L\'email doit être valide',
                'any.required': 'L\'email est requis'
            }),
        USR_pass: Joi.string()
            .min(8)
            .regex(/[A-Z]/, 'au moins une lettre majuscule')
            .regex(/[0-9]/, 'au moins un chiffre')
            .regex(/[@$!%*?&]/, 'au moins un caractère spécial')
            .required()
            .messages({
                'string.min': 'Le mot de passe doit contenir au moins 8 caractères',
                'string.pattern.name': 'Le mot de passe doit inclure au moins une lettre majuscule, un chiffre et un caractère spécial',
                'any.required': 'Le mot de passe est requis',
            }),
        USR_prenom: commonSchema.maxLength50
            .messages(commonSchema.messages.maxLength),
        USR_nom: commonSchema.maxLength50
            .messages(commonSchema.messages.maxLength),
        USR_role: Joi.string().valid('parent', 'orthophoniste', 'admin').required()
            .messages({
                'any.only': 'Le rôle doit être parent, orthophoniste ou admin',
                'any.required': 'Le rôle est requis'
            }),
        USR_telephone: Joi.string().pattern(/^[0-9]{10,15}$/),
        USR_statut: commonSchema.activeStatus
            .messages(commonSchema.messages.status)
    }),

    params: Joi.object(buildParamsSchema('usr'))
};

module.exports = userSchema;
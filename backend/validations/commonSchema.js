import Joi from 'joi';

const commonSchema = {
    // ID validations
    id: Joi.number().integer().required(),
    
    // Common status
    activeStatus: Joi.string().valid('actif', 'inactif').required(),
    
    // Common dates
    date: Joi.date(),
    requiredDate: Joi.date().required(),
    
    // Common strings
    maxLength50: Joi.string().max(50),
    maxLength255: Joi.string().max(255),
    
    // Common messages
    messages: {
        id: {
            'number.base': 'L\'ID doit être un nombre',
            'any.required': 'L\'ID est requis'
        },
        status: {
            'any.only': 'Le statut doit être actif ou inactif',
            'any.required': 'Le statut est requis'
        },
        date: {
            'date.base': 'La date doit être valide',
            'any.required': 'La date est requise'
        },
        maxLength: {
            'string.max': 'Le texte ne peut pas dépasser {#limit} caractères'
        }
    }
};

// Common params schema builder
const buildParamsSchema = (entityName) => ({
    [`${entityName}Id`]: commonSchema.id
        .messages({
            'number.base': `L'ID ${entityName} doit être un nombre`,
            'any.required': `L'ID ${entityName} est requis`
        })
});

export { commonSchema, buildParamsSchema };
const Joi = require('joi');

const userSchema = {
  create: Joi.object({
    USR_email: Joi.string().email().required()
      .messages({
        'string.email': 'L\'email doit être valide',
        'any.required': 'L\'email est requis'
      }),
    USR_pass: Joi.string().min(6).required()
      .messages({
        'string.min': 'Le mot de passe doit contenir au moins 6 caractères',
        'any.required': 'Le mot de passe est requis'
      }),
    USR_prenom: Joi.string().max(50)
      .messages({
        'string.max': 'Le prénom ne peut pas dépasser 50 caractères'
      }),
    USR_nom: Joi.string().max(50)
      .messages({
        'string.max': 'Le nom ne peut pas dépasser 50 caractères'
      }),
    USR_role: Joi.string().valid('parent', 'orthophoniste', 'admin').required()
      .messages({
        'any.only': 'Le rôle doit être parent, orthophoniste ou admin',
        'any.required': 'Le rôle est requis'
      }),
    USR_telephone: Joi.string().pattern(/^[0-9]{10,15}$/)
      .messages({
        'string.pattern.base': 'Le numéro de téléphone doit contenir entre 10 et 15 chiffres'
      }),
    USR_statut: Joi.string().valid('actif', 'inactif').required()
      .messages({
        'any.only': 'Le statut doit être actif ou inactif',
        'any.required': 'Le statut est requis'
      })
  }),

  params: Joi.object({
    usrId: Joi.number().integer().required()
      .messages({
        'number.base': 'L\'ID utilisateur doit être un nombre',
        'any.required': 'L\'ID utilisateur est requis'
      })
  }),

};

module.exports = userSchema;
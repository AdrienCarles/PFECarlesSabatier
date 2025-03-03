import Joi from 'joi';

const authSchema = {
  login: Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'L\'email doit être valide',
      'any.required': 'L\'email est requis',
    }),
    password: Joi.string().required().messages({
      'any.required': 'Le mot de passe est requis',
    }),
  }),
  refresh: Joi.object({
    refreshToken: Joi.string().required().messages({
      'any.required': 'Le token de rafraîchissement est requis',
    }),
  }),
};

export default authSchema;
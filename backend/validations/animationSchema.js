import Joi from 'joi';
import { commonSchema, buildParamsSchema } from './commonSchema.js';

const animationSchema = {
    create: Joi.object({
        ANI_titre: commonSchema.maxLength50.required()
            .messages({
                ...commonSchema.messages.maxLength,
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
        SES_id: commonSchema.id
            .messages(commonSchema.messages.id),
        USR_creator_id: commonSchema.id
            .messages(commonSchema.messages.id),
        ANI_duree: Joi.number().positive()
            .messages({
                'number.positive': 'La durée doit être positive'
            })
    }),

    params: Joi.object(buildParamsSchema('ani')),
    serieParams: Joi.object(buildParamsSchema('ses')),

    query: Joi.object({
        titre: commonSchema.maxLength50,
        type: Joi.string().valid('dessin', 'réel'),
        page: Joi.number().integer().min(1),
        limit: Joi.number().integer().min(1).max(100)
    })
};

export default animationSchema;
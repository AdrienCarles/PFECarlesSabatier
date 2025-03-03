import Joi from 'joi';
import { commonSchema, buildParamsSchema } from './commonSchema.js';

const statistiqueSchema = {
    create: Joi.object({
        ENFA_id: commonSchema.id
            .messages(commonSchema.messages.id),
        SES_id: commonSchema.id
            .messages(commonSchema.messages.id),
        STAT_tempUtil: Joi.string().pattern(/^([0-9]{1,2}):([0-5][0-9]):([0-5][0-9])$/)
            .messages({
                'string.pattern.base': 'Le temps d\'utilisation doit être au format HH:mm:ss'
            }),
        STAT_dernierAcces: commonSchema.date
            .messages(commonSchema.messages.date)
    }),

    params: Joi.object(buildParamsSchema('stat')),
    enfantParams: Joi.object(buildParamsSchema('enfa')),
    serieParams: Joi.object(buildParamsSchema('ses')),

    query: Joi.object({
        dateDebut: commonSchema.date.messages(commonSchema.messages.date),
        dateFin: commonSchema.date.messages(commonSchema.messages.date),
        limit: Joi.number().integer().min(1).max(100),
        page: Joi.number().integer().min(1)
    })
};

export default statistiqueSchema;
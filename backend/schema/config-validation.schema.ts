import * as Joi from 'joi';

export const configValidationSchema = Joi.object({
  STAGE: Joi.string()
    .required()
    .valid('development', 'production')
    .default('development'),
  DB_HOST: Joi.string().required().default('localhost'),
  DB_PORT: Joi.number().required().default(5432),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_DATABASE: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRATION: Joi.alternatives().try(Joi.number(), Joi.string()).required(),
  GOOGLE_CLIENT_ID: Joi.string().required(),
  GOOGLE_CLIENT_SECRET: Joi.string().required(),
  GOOGLE_CALLBACK_URL: Joi.string().required(),
  FRONTEND_URL_REDIRECT: Joi.string().required(),
});

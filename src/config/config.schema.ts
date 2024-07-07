import * as Joi from 'joi';

export const envSchema = Joi.object({
  HOST: Joi.string(),
  PORT: Joi.number().required(),
  UNISWAP_V2_FACTORY_ADDRESS: Joi.string(),
  NODE_URL: Joi.string(),
});

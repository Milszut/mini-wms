import Joi from "joi";

export const serviceSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(1)
    .max(100)
    .required()
    .messages({
      "string.base": "Nazwa działu musi być tekstem!",
      "string.empty": "Podaj nazwę działu!",
      "string.min": "Podaj nazwę działu!",
      "string.max": "Nazwa działu nie może mieć więcej niż 100 znaków!",
      "any.required": "Podaj nazwę działu!",
    }),
});
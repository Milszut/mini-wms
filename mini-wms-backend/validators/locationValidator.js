import Joi from "joi";

export const locationSchema = Joi.object({
  name: Joi.string()
    .trim()
    .min(1)
    .max(100)
    .required()
    .messages({
      "string.base": "Nazwa lokalizacji musi być tekstem!",
      "string.empty": "Podaj nazwę lokalizacji!",
      "string.min": "Podaj nazwę lokalizacj!",
      "string.max": "Nazwa lokalizacji nie może mieć więcej niż 100 znaków!",
      "any.required": "Podaj nazwę lokalizacji!",
    }),
});
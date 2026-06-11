import Joi from "joi";

export const itemSchema = Joi.object({
  item_name: Joi.string()
    .max(100)
    .required()
    .messages({
      "string.base": "Nazwa przedmiotu jest wymagana!",
      "string.empty": "Nazwa przedmiotu jest wymagana!",
      "string.max": "Nazwa przedmiotu nie może mieć więcej niż 100 znaków!",
    }),

  serial_number: Joi.string()
    .allow("", null)
    .max(100)
    .messages({
      "string.max": "Numer seryjny nie może mieć więcej niż 100 znaków!",
    }),

  quantity: Joi.number()
    .integer()
    .min(1)
    .max(99999999)
    .required()
    .messages({
      "number.base": "Podaj ilość!",
      "number.integer": "Ilość musi być liczbą całkowitą!",
      "number.min": "Ilość musi być większa od zera!",
      "number.max": "Ilość nie może mieć więcej niż 8 cyfr!",
      "any.required": "Podaj ilość!",
    }),

  unit_price: Joi.number()
    .precision(2)
    .min(0)
    .max(99999999.99)
    .required()
    .messages({
      "number.base": "Podaj cenę!",
      "number.precision":
        "Cena jednostkowa może mieć maksymalnie 2 miejsca po przecinku!",
      "any.required": "Podaj cenę jednostkową!",
    }),

  location_id: Joi.number()
    .integer()
    .min(1)
    .required()
    .messages({
      "number.base": "Wybierz lokalizacje!",
      "number.integer": "Wybierz lokalizacje!",
      "any.required": "Wybierz lokalizacje!",
    }),

  service_id: Joi.number()
    .integer()
    .min(1)
    .required()
    .messages({
      "number.base": "Wybierz dział!",
      "number.integer": "Wybierz dział!",
      "any.required": "Wybierz dział!",
    }),

  condition_id: Joi.number()
    .integer()
    .min(1)
    .required()
    .messages({
      "number.base": "Wybierz stan!",
      "number.integer": "Wybierz stan!",
      "any.required": "Wybierz stan!",
    }),

  status_id: Joi.number()
    .integer()
    .min(1)
    .required()
    .messages({
      "number.base": "Wybierz status!",
      "number.integer": "Wybierz status!",
      "any.required": "Wybierz status!",
    }),

  notes: Joi.string().allow("", null).max(2000).messages({
    "string.max": "Uwagi nie mogą mieć więcej niż 2000 znaków!",
  }),

  image_path: Joi.any().optional(),
});
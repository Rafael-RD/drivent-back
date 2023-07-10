import Joi from 'joi';
import { CreatePaymentReqBody, GetPaymentQuery } from '@/services';

export const getPaymentSchema = Joi.object<GetPaymentQuery>({
  ticketId: Joi.number().min(0).required(),
});

export const createPaymentSchema = Joi.object<CreatePaymentReqBody>({
  ticketId: Joi.number().required(),
  cardData: {
    issuer: Joi.string().required(),
    number: Joi.number().required(),
    name: Joi.string().required(),
    expirationDate: Joi.custom(expirationDateValidation).required(),
    cvv: Joi.number().required(),
  },
});

function expirationDateValidation(value: string, helpers: Joi.CustomHelpers<string>) {
  if (!value) return value;

  const expirationDateRegEx = /^\d?\d\/\d{4}$/;
  if (!value.match(expirationDateRegEx)) return helpers.error('any.invalid');

  const [month, year] = value.split('/');
  const nMonth = Number(month);
  const nYear = Number(year);

  if (nMonth < 1 || nMonth > 12) return helpers.error('any.invalid');

  const todayDate = new Date();
  if (todayDate.getFullYear() > nYear) return helpers.error('any.invalid');
  else if (todayDate.getMonth() + 1 > nMonth && todayDate.getFullYear() === nYear) return helpers.error('any.invalid');

  return value;
}

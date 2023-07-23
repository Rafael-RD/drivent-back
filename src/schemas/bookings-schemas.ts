import Joi from "joi";
import { BookingReqBody } from "@/services";

export const bookingSchema = Joi.object<BookingReqBody>({
    roomId: Joi.number().min(0).required(),
})
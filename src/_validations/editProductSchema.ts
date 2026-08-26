import { AddProductSchema, imagesSchema } from "./addProductSchema";
import * as yup from'yup'

const imageItemSchema = yup.object({
  id: yup.number().required(),
  image:yup.string().required()
})
export const EditProductSchema = AddProductSchema.shape({
  oldImages:yup.array().of(imageItemSchema).default([]),
  id:yup.number(),
});
export type EditProductType = yup.InferType<typeof EditProductSchema>
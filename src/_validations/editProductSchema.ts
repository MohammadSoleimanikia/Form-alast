import { AddProductSchema, imagesSchema } from "./addProductSchema";
import * as yup from'yup'

export const EditProductSchema = AddProductSchema.shape({
  oldImages: imagesSchema,
  id:yup.number(),
});
export type EditProductType = yup.InferType<typeof EditProductSchema>
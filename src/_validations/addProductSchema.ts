import { LATIN_REGEX } from '@/utils/regex';
import * as yup from 'yup';
const allowedImageTypes = ['image/jpeg', 'image/png', 'image/webp'];

const imageSchema = yup
  .mixed<File>()
  .nullable()
  .test('file-type', 'فرمت تصویر باید jpg، jpeg، png یا webp باشد', (file) => {
    if (!file) return true;

    return allowedImageTypes.includes(file.type);
  });

const imagesSchema = yup
  .array()
  .of(
    yup
      .mixed<File>()
      .test('file-type', 'فرمت تصویر باید jpg، jpeg، png یا webp باشد', (file) => {
        if (!file) return true;

        return allowedImageTypes.includes(file.type);
      }),
  )
  .default([]);


export const AddProductSchema = yup.object({
  name: yup
    .string()
    .required('نام محصول الزامی است.')
    .min(2, 'نام محصول باید حداقل 2 کاراکتر باشد')
    .max(50, 'نام محصول باید حداکثر 50 کاراکتر باشد'),

  en_name: yup
    .string()
    .required('نام لاتین محصول الزامی است.')
    .min(2, 'نام لاتین محصول باید حداقل 2 کاراکتر باشد')
    .max(50, 'نام  لاتین محصول باید حداکثر 50 کاراکتر باشد')
    .matches(LATIN_REGEX, 'عنوان لاتین باید فقط شامل حروف انگلیسی باشد'),

  brand: yup.string().optional(),

  category: yup.number().required('دسته بندی محصول الزامی است'),
  subCategory_id: yup.number().required('انتخاب زیر گزوه محصول الزامی است'),
  accCode: yup.string().required('کد حسابداری الزامی است'),
  color_code: yup.string(),
  color_name: yup.string(),
  // number or string.
  opening_type: yup.string(),
  price: yup.number().required('قیمت نقدی الزامی است '),

  // state :????
  minSalesCount: yup
    .number()
    .required('حداقل تعداد سفارش الزامی است')
    .test(
      'min-sale-count-check',
      'حداقل تعداد فروش نمی‌تواند بیشتر از موجودی انبار باشد',
      function (value) {
        const { warehouseInventory } = this.parent;
        if (value == null || warehouseInventory == null) return true;
        return value <= warehouseInventory;
      },
    ),

  warehouseInventory: yup.number().required('موجودی انبار الزامی است'),
  
  image: imageSchema,

  secondary_image: imageSchema,

  images: imagesSchema,
  shortDescription: yup
    .string()
    .required('توضیحات الزامی میباشد ')
    .min(5, 'حداقل 5 کاراکتر الزامی میباشد'),
  // description ck editor

  hasDiscount: yup.boolean(),
  discount: yup.number().when('hasDiscount', {
    is: true,
    then: (schema) =>
      schema
        .required('مقدار تخفیف الزامی میباشد')
        .min(1, 'تخفیف نباید از یک درصد کمتر باشد')
        .max(100, 'تخفیف نباید از صد بیشتر باشد'),
    otherwise: (schema) => schema.notRequired(),
  }),
  discount_start_time: yup.date().when('hasDiscount', {
    is: true,
    then: (schema) => schema.required('تاریخ شروع تخفیف الزامی میباشد'),
    otherwise: (schema) => schema.notRequired(),
  }),
  discount_end_time: yup.date().when('hasDiscount', {
    is: true,
    then: (schema) => schema.required('تاریخ پایان تخفیف الزامی میباشد'),
    otherwise: (schema) => schema.notRequired(),
  }),

  inventory: yup.number().required('وضعیت موجودی الزامی میباشد '),
  width: yup.number().required('عرض محصول الزامی است'),
  height: yup.number().required('ارتفاع محصول الزامی است'),
  material: yup
    .string()
    .required('جنس محصول الزامی است')
    .min(2, 'حداقل 2 کاراکتر نیاز است'),
  // images[1]images[0]
});

export type AddProductType = yup.InferType<typeof AddProductSchema>;

import Page from '@/components/Page';
import { yupResolver } from '@hookform/resolvers/yup';
import { AddProductSchema, type AddProductType } from '@/_validations/addProductSchema';
import { useForm } from 'react-hook-form';
import FormProvider from '@/components/react-hook-form/FormProvider';
import RHFTextField from '@/components/react-hook-form/RHFTextField';
import FormSectionWrapper from '@/components/react-hook-form/FormSectionWrapper';
import { FaCheck, FaDoorClosed, FaNewspaper, FaRegNewspaper } from 'react-icons/fa';
import RHFSelectAutoComplete from '@/components/react-hook-form/RHFSelectAutoComplete';
import useSWR from 'swr';
import { getFetcher } from '@/utils/getFetcher';
import {
  API_PATH_ADD_PRODUCT,
  API_PATH_GET_PRODUCT_CATEGORY,
  API_PATH_GET_PRODUCT_GROUP,
} from '@/routes/path';
import { BaseResponse } from '@/_types/_bsResponse';
import RHFNumField from '@/components/react-hook-form/RHFNumField';
import { IoIosPricetag } from 'react-icons/io';
import { AiFillPicture } from 'react-icons/ai';
import RHFSwitch from '@/components/react-hook-form/RHFSwitch';
import RHFSelect from '@/components/react-hook-form/RHFSelect';
import RHFDatePicker from '@/components/react-hook-form/RHFDatePicker';
import { useEffect, useState } from 'react';
import RHFUpload from '@/components/react-hook-form/RHFUpload';
import RHFColor from '@/components/react-hook-form/RHFColor';
import RHFTagsInput from '@/components/react-hook-form/RHFTagsInput';
import InfoCKEditor from '@/components/InfoCKEditor';
import RHFCKEditor from '@/components/react-hook-form/RHFCKText';
import { Button } from '@mui/material';
import clsx from 'clsx';
import useSWRMutation from 'swr/mutation';
import { postFetcher } from '@/utils/postFetcher';
import toast from 'react-hot-toast';
const stockStatus = [
  { id: 1, name: 'موجود' },
  { id: 0, name: 'ناموجود' },
];
const openingType = [
  { id: 1, name: 'راست بازشو' },
  { id: 2, name: 'چپ بازشو' },
];

type GroupResponse = {
  id: number;
  name: string;
  parent: number;
}[];
type CategoryResponse = { id: number; name: string }[];
export default function AddProductPage() {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  // get data for autoSelect
  const { trigger, error, isMutating } = useSWRMutation(
    API_PATH_ADD_PRODUCT,
    postFetcher,
  );

  const {
    data: categoryData,
    error: categoryError,
    isLoading: isLoadingCategory,
  } = useSWR<BaseResponse<CategoryResponse>>(
    API_PATH_GET_PRODUCT_CATEGORY,
    getFetcher<CategoryResponse>,
  );

  const {
    data: groupData,
    error: groupError,
    isLoading: isLoadingGroup,
  } = useSWR<BaseResponse<GroupResponse>>(
    API_PATH_GET_PRODUCT_GROUP,
    getFetcher<GroupResponse>,
  );

  const methods = useForm<AddProductType>({
    mode: 'onSubmit',
    resolver: yupResolver(AddProductSchema),
    defaultValues: {
      discount_start_time: Date.now(),
      inventory: 1,
      minSalesCount: 1,
      opening_type: 1,
      color_code: '#D6A54A',
    },
  });
  // watch RHF
  const categoryId = methods.watch('category');
  const haveDiscount = methods.watch('hasDiscount');
  const startTime = methods.watch('discount_start_time');

  const description = methods.watch('description');

  useEffect(() => {
    if (!startTime) return;

    methods.setValue('discount_end_time', startTime + 60 * 60 * 1000, {
      shouldValidate: true,
      shouldDirty: true,
    });
  }, [startTime, methods.setValue]);

  const filteredGroup = groupData?.data?.filter((group) => group.parent === categoryId);

  const testSubmit = () => {
    const div = document.createElement('div');
    div.innerHTML = description ?? '';

    const currentImages = Array.from(div.querySelectorAll('img')).map((img) => img.src);

    const deletedImages = uploadedImages.filter((url) => !currentImages.includes(url));

    console.log('تصاویر آپلود شده:', uploadedImages);
    console.log('تصاویر درون ادیتور:', currentImages);
    console.log('تصاویر حذف شده:', deletedImages);
  };

  const submitHandler = async (data: AddProductType) => {
    const formData = new FormData();

    // discount
    formData.append('hasDiscount', String(data.hasDiscount));

    if (data.hasDiscount) {
      formData.append('discount_end_time', String(data.discount_end_time));
      formData.append('discount_start_time', String(data.discount_start_time));
      formData.append('discount', String(data.discount));
    }

    // images
    data.images.forEach((image, index) => {
      formData.append(`images[${index}]`, image);
    });

    // tags
    data.tags?.forEach((tag, index) => {
      if (tag) {
        formData.append(`tags[${index}]`, tag);
      }
    });

    // other fields
    formData.append('warehouseInventory', String(data.warehouseInventory));
    formData.append('minSalesCount', String(data.minSalesCount));
    formData.append('material', data.material);
    formData.append('height', String(data.height));
    formData.append('width', String(data.width));
    formData.append('inventory', String(data.inventory));
    formData.append('description', data.description);
    formData.append('shortDescription', data.shortDescription);
    formData.append('secondary_image', data.secondary_image);
    formData.append('image', data.image);
    formData.append('price', String(data.price));
    formData.append('opening_type', String(data.opening_type));
    formData.append('color_name', data.color_name);
    formData.append('color_code', data.color_code);
    formData.append('accCode', String(data.accCode));
    formData.append('category', String(data.category));
    formData.append('subCategory_id', String(data.subCategory_id));
    
    if (data.brand) {
      formData.append('brand', data.brand);
    }
    formData.append('en_name', data.en_name);
    formData.append('name', data.name);

    try {
      await trigger(formData);

      toast.success('محصول با موفقیت ثبت شد');
    } catch (error) {
      toast.error('مشکلی پیش آمده است');
    }
  };
  return (
    <Page title="ایجاد محصول آماده جدید" disableHeaderTitle>
      <div className="mx-auto mt-6 flex size-full w-full flex-col px-6">
        <FormProvider
          className="w-full"
          methods={methods}
          onSubmit={methods.handleSubmit(submitHandler)}
        >
          <div className="flex flex-col gap-5">
            {/* main data ----------------------------------------------------------------*/}
            <FormSectionWrapper
              isGrid={true}
              title="اطلاعات اصلی"
              description="مشخصات کلی محصول را مشخص کنید"
              icon={<FaDoorClosed className="size-6" />}
            >
              {/* product name */}
              <RHFTextField
                labelText={'نام محصول*'}
                placeholder="مثال: درب ساختمانی ..."
                name={'name'}
              />

              {/* product en-name */}
              <RHFTextField
                labelText="نام لاتین محصول*"
                placeholder="مثال: apartment-door"
                name={'en_name'}
              />

              {/* category */}
              <RHFSelectAutoComplete
                isDataLoading={isLoadingCategory}
                loading={isLoadingCategory}
                loadingText="در حال بارگیری "
                labelText="انتخاب دسته بندی*"
                name="category"
                options={categoryData?.data ?? []}
              />

              {/* group */}
              <RHFSelectAutoComplete
                isDataLoading={isLoadingGroup}
                noOptionsText="اطلاعات زیرگروه موجود نمیباشد"
                labelText="انتخاب گروه*"
                disabled={!categoryId}
                name="subCategory_id"
                options={filteredGroup ?? []}
              />

              {/* brand */}
              <RHFTextField
                labelText="انتخاب برند"
                placeholder="مثال: ایران پروفیل"
                name={'brand'}
              />

              <RHFNumField labelText="کد حسابداری*" name="accCode" />
            </FormSectionWrapper>

            {/* price and stock -----------------------------------------------------------*/}
            <FormSectionWrapper
              isGrid={true}
              title="قیمت و موجودی"
              description="قیمت گذاری و وضعیت موجود محصول را مشخص کنید"
              icon={<IoIosPricetag className="size-6" />}
              discountSection={<RHFSwitch name="hasDiscount" labelText="اعمال تخفیف" />}
            >
              <RHFNumField
                placeholder="مثال 200,000,000 تومان"
                labelText="قیمت محصول*"
                name="price"
                formatNumber
              />

              <RHFSelect labelText="وضعیت*" name="inventory" options={stockStatus} />

              <RHFNumField labelText="حداقل تعداد سفارش*" name="minSalesCount" />

              <RHFNumField
                placeholder="مثال 500 عدد"
                labelText="موجودی انبار*"
                name="warehouseInventory"
              />

              {/* discount section */}
              {haveDiscount && (
                <>
                  <RHFNumField
                    placeholder="مثال 14 درصد"
                    labelText=" میزان تخفیف*"
                    name="discount"
                  />

                  <RHFDatePicker
                    name="discount_start_time"
                    labelText="تاریخ شروع*"
                    minDate={new Date()}
                  />

                  <RHFDatePicker
                    name="discount_end_time"
                    labelText="تاریخ پایان*"
                    minDate={
                      startTime
                        ? new Date(new Date(startTime).getTime() + 60 * 60 * 1000)
                        : new Date()
                    }
                  />
                </>
              )}
            </FormSectionWrapper>

            {/* product Images ----------------------------------------------------------- */}
            <FormSectionWrapper
              isGrid={false}
              title="تصاویر محصول"
              description="تصاویر محصول را با دقت و زوایا مختلف آپلود کنید"
              icon={<AiFillPicture className="size-6" />}
            >
              <div className="mb-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
                <RHFUpload name="image" title="بارگزاری تصویر اصلی" multiple={false} />

                <RHFUpload
                  name="secondary_image"
                  title="بارگزاری تصویر ثانویه"
                  multiple={false}
                />
              </div>

              <RHFUpload name="images" title="بارگزاری تصاویر فرعی" multiple={true} />
            </FormSectionWrapper>

            {/* additional product ------------------------------------------------------------------------------ */}
            <FormSectionWrapper
              isGrid={true}
              title="مشخصات تکمیلی محصول"
              description="ویژگی های فنی و ظاهری محصول را وارد کنید"
              icon={<FaRegNewspaper className="size-6" />}
            >
              <RHFTextField
                placeholder="مثال: چوبی"
                labelText="جنس محصول*"
                name="material"
              />
              <RHFNumField
                labelText="عرض محصول*"
                placeholder="مثال 120 سانت"
                name="width"
              />
              <RHFNumField
                labelText="ارتفاع محصول*"
                placeholder="مثال 210 سانت"
                name="height"
              />
              <RHFColor
                labelText="انتخاب رنگ محصول"
                placeholder="نام رنگ "
                name="color_name"
                colorCodeName="color_code"
              />
              <RHFSelect
                labelText="جهت بازشوی محصول*"
                name="opening_type"
                options={openingType}
              />
              <RHFTagsInput labelText="برچسب ها *" name="tags" />
            </FormSectionWrapper>

            {/* product detail ------------------------------------------------------------------------------------*/}
            <FormSectionWrapper
              isGrid={false}
              title="توضیحات محصول"
              description="توضیحات کامل و تکمیلی محصول را وارد کنید"
              icon={<AiFillPicture className="size-6" />}
            >
              <div className="flex w-full flex-col gap-5">
                <RHFTextField
                  rows={7}
                  multiline={true}
                  labelText="توضیحات کوتاه محصول"
                  name="shortDescription"
                  placeholder="توضیحات کوتاه و تکمیلی محصول..."
                />

                <InfoCKEditor />
                <RHFCKEditor
                  name="description"
                  labelText="توضیحات محصول"
                  onImagesChange={setUploadedImages}
                />
              </div>
              <div className="mr-auto mt-8 flex justify-end">
                <Button
                  variant="contained"
                  startIcon={<FaCheck />}
                  size="medium"
                  className={clsx(
                    'bg-[w-full disabled:bg-primary-light sm:w-fit] disabled:bg-primary-light',
                    'mr-auto h-10 w-full min-w-[136px] !bg-[#966e22] sm:w-fit',
                  )}
                  type="submit"
                >
                  ثبت محصول
                </Button>
                <Button variant="outlined" className='mr-3' onClick={testSubmit}>
                  تصاویر حذف شده
                </Button>
              </div>
            </FormSectionWrapper>
          </div>
        </FormProvider>
      </div>
    </Page>
  );
}

import Page from '@/components/Page';
import { yupResolver } from '@hookform/resolvers/yup';
import { AddProductSchema, type AddProductType } from '@/_validations/addProductSchema';
import { useForm } from 'react-hook-form';
import FormProvider from '@/components/react-hook-form/FormProvider';
import RHFTextField from '@/components/react-hook-form/RHFTextField';
import FormSectionWrapper from '@/components/react-hook-form/FormSectionWrapper';
import { FaDoorClosed, FaRegNewspaper } from 'react-icons/fa';
import RHFSelectAutoComplete from '@/components/react-hook-form/RHFSelectAutoComplete';
import useSWR from 'swr';
import { getFetcher } from '@/utils/getFetcher';
import { API_PRODUCT } from '@/routes/path';
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
import useSWRMutation from 'swr/mutation';
import { postFetcher } from '@/utils/postFetcher';
import toast from 'react-hot-toast';
import ProgressButton from '@/components/ProgressButton';
import { useProgress } from '@/hooks/useProgress';
import { CategoryResponse, GroupResponse } from '@/_types/product/_product';
import { STOCK_STATUS_DATA } from '@/sections/product/STOCK_STATUS_DATA';
import { OPENING_TYPE_DATA } from '@/sections/product/OPENING_TYPE';

export default function AddProductPage() {
  const { progressPercentage, setProgressPercentage, resetProgress } = useProgress();

  //add product
  const {
    trigger,
    isMutating: formIsSubmitting,
  } = useSWRMutation(API_PRODUCT.ADD_PRODUCT, postFetcher);

  // get category data
  const {
    data: categoryData,
    isLoading: isLoadingCategory,
  } = useSWR<BaseResponse<CategoryResponse>>(
    API_PRODUCT.GET_PRODUCT_CATEGORY,
    getFetcher<CategoryResponse>,
  );
  // get group data
  const {
    data: groupData,
    isLoading: isLoadingGroup,
  } = useSWR<BaseResponse<GroupResponse>>(
    API_PRODUCT.GET_PRODUCT_GROUP,
    getFetcher<GroupResponse>,
  );

  const methods = useForm<AddProductType>({
    mode: 'onChange',
    resolver: yupResolver(AddProductSchema),
    defaultValues: {
      discount_start_time: Date.now(),
      inventory: 1,
      minSalesCount: 1,
      opening_type: 1,
      color_code: '#D6A54A',
    },
  });
  const { watch, setValue, reset,handleSubmit } = methods;

  // watch RHF
  const categoryId = watch('category');
  const haveDiscount = watch('hasDiscount');
  const startTime = watch('discount_start_time');


  // set data of dateTime to one hours later of start time
  useEffect(() => {
    if (!startTime) return;

    setValue('discount_end_time', startTime + 60 * 60 * 1000, {
      shouldValidate: true,
      shouldDirty: true,
    });
  }, [startTime, setValue]);

  // filter Group based on parent id
  const filteredGroup = groupData?.data?.filter((group) => group.parent === categoryId);


  const submitHandler = async (data: AddProductType) => {
    const formData = new FormData();
    // append data to FormData 
    for (const [key, value] of Object.entries(data)) {
      if (key === 'hasDiscount') {
        formData.append(key, String(value));
        if (value) {
          if (data.discount_start_time) {
            formData.append(
              'discount_start_time',
              String(data.discount_start_time / 1000),
            );
          }
          if (data.discount_end_time) {
            formData.append('discount_end_time', String(data.discount_end_time / 1000));
          }
          formData.append('discount', String(data.discount));
        }

        continue;
      }

      if (key === 'images') {
        data.images?.forEach((image, index) => {
          if (image) {
            formData.append(`images[${index}]`, image);
          }
        });
        continue;
      }

      if (key === 'tags') {
        data.tags?.forEach((tag, index) => {
          if (tag) {
            formData.append(`tags[${index}]`, tag);
          }
        });
        continue;
      }

      if (key === 'brand') {
        if (value) {
          formData.append('brand', String(value));
        }
        continue;
      }

      if (key === 'secondary_image') {
        formData.append('secondary_image', data.secondary_image);
        continue;
      }
      if (key === 'image') {
        formData.append('image', data.image);
        continue;
      }

      // because this values added in discount section
      if (
        key === 'discount_start_time' ||
        key === 'discount_end_time' ||
        key === 'discount'
      ) {
        continue;
      }

      if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    }

    try {
      await trigger({ data: formData, onProgress: setProgressPercentage });

      toast.success('محصول با موفقیت ثبت شد');
      reset({
        discount_start_time: Date.now(),
        inventory: 1,
        minSalesCount: 1,
        opening_type: 1,
        color_code: '#D6A54A',
      });
      resetProgress();
    } catch (error) {
      toast.error('مشکلی پیش آمده است');
      resetProgress();
    }
  };
  return (
    <Page title="ایجاد محصول آماده جدید" disableHeaderTitle>
      <div className="mx-auto mt-6 flex size-full w-full flex-col px-6">
        <FormProvider
          className="w-full"
          methods={methods}
          onSubmit={handleSubmit(submitHandler)}
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

              <RHFSelect
                labelText="وضعیت*"
                name="inventory"
                options={STOCK_STATUS_DATA}
              />

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
                    minDateTime={
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
                options={OPENING_TYPE_DATA}
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
                <RHFCKEditor name="description" labelText="توضیحات محصول" />
              </div>
              <div className="mr-auto mt-8 flex justify-end">
                <ProgressButton
                  progressPercentage={progressPercentage}
                  isLoading={formIsSubmitting}
                >
                  ایجاد محصول
                </ProgressButton>
              </div>
            </FormSectionWrapper>
          </div>
        </FormProvider>
      </div>
    </Page>
  );
}

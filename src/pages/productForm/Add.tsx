import Page from '@/components/Page';
import { yupResolver } from '@hookform/resolvers/yup';
import { AddProductSchema, type AddProductType } from '@/_validations/addProductSchema';
import { useForm } from 'react-hook-form';
import FormProvider from '@/components/react-hook-form/FormProvider';
import RHFTextField from '@/components/react-hook-form/RHFTextField';
import FormSectionWrapper from '@/components/react-hook-form/FormSectionWrapper';
import { FaDoorClosed } from 'react-icons/fa';
import RHFSelectAutoComplete from '@/components/react-hook-form/RHFSelectAutoComplete';
import useSWR from 'swr';
import { getFetcher } from '@/utils/getFetcher';
import { API_PATH_GET_PRODUCT_CATEGORY, API_PATH_GET_PRODUCT_GROUP } from '@/routes/path';
import { BaseResponse } from '@/_types/_bsResponse';
import RHFNumTextField from '@/components/react-hook-form/RHFNumTextField';
import { IoIosPricetag } from 'react-icons/io';
import { AiFillPicture } from 'react-icons/ai';
import RHFSwitch from '@/components/react-hook-form/RHFSwitch';
import RHFSelect from '@/components/react-hook-form/RHFSelect';
import RHFDatePicker from '@/components/react-hook-form/RHFDatePicker';
import { useEffect } from 'react';
import { Input } from '@mui/material';
import RHFUpload from '@/components/react-hook-form/RHFUpload';
const stockStatus = [
  { id: 1, name: 'موجود' },
  { id: 0, name: 'ناموجود' },
];
type GroupResponse = {
  id: number;
  name: string;
  parent: number;
}[];
type CategoryResponse = { id: number; name: string }[];
export default function AddProductPage() {
  // get data for autoSelect

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

  console.log(categoryData);
  const methods = useForm<AddProductType>({
    mode: 'onSubmit',
    resolver: yupResolver(AddProductSchema),
    defaultValues: {
      discount_start_time: new Date(),
      inventory: 1,
      minSalesCount: 1,
    },
  });
  // watch RHF
  const categoryId = methods.watch('category');
  const haveDiscount = methods.watch('hasDiscount');
  const startTime = methods.watch('discount_start_time');

  useEffect(() => {
    if (!startTime) return;

    const start = new Date(startTime);
    const minEnd = new Date(start.getTime() + 60 * 60 * 1000);

    methods.setValue('discount_end_time', minEnd, {
      shouldValidate: true,
      shouldDirty: true,
    });
  }, [startTime, methods.setValue]);
  const filteredGroup = groupData?.data?.filter((group) => group.parent === categoryId);
  const submitHandler = (data: AddProductType) => {
    console.log(data);
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
            {/* main data */}
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
                size="small"
              />

              {/* product en-name */}
              <RHFTextField
                labelText="نام لاتین محصول*"
                placeholder="مثال: apartment-door"
                name={'en_name'}
                size="small"
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
                size="small"
              />

              <RHFNumTextField labelText="کد حسابداری*" name="accCode" />
            </FormSectionWrapper>

            {/* price and stock */}
            <FormSectionWrapper
              isGrid={true}
              title="قیمت و موجودی"
              description="قیمت گذاری و وضعیت موجود محصول را مشخص کنید"
              icon={<IoIosPricetag className="size-6" />}
              discountSection={<RHFSwitch name="hasDiscount" labelText="اعمال تخفیف" />}
            >
              <RHFNumTextField
                placeholder="مثال 200,000,000 تومان"
                labelText="قیمت محصول*"
                name="price"
                formatNumber
              />

              <RHFSelect labelText="وضعیت*" name="inventory" options={stockStatus} />

              <RHFNumTextField labelText="حداقل تعداد سفارش*" name="minSalesCount" />

              <RHFNumTextField
                placeholder="مثال 500 عدد"
                labelText="موجودی انبار*"
                name="warehouseInventory"
              />

              {/* discount section */}
              {haveDiscount && (
                <>
                  <RHFNumTextField
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

            <FormSectionWrapper
              isGrid={false}
              title="تصاویر محصول"
              description="تصاویر محصول را با دقت و زوایا مختلف آپلود کنید"
              icon={<AiFillPicture className="size-6" />}
            >
              <div className='grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8'>
                <RHFUpload name="image" title="بارگزاری تصویر اصلی" multiple={false} />

                <RHFUpload
                  name="secondary_image"
                  title="بارگزاری تصویر ثانویه"
                  multiple={false}
                />
              </div>

              <RHFUpload  name="images" title="بارگزاری تصاویر فرعی" multiple={true} />
            </FormSectionWrapper>
          </div>

          <button type="submit">submit</button>
        </FormProvider>
      </div>
    </Page>
  );
}

import Page from '@/components/Page';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  EditProductSchema,
  type EditProductType,
} from '@/_validations/editProductSchema';
import { useForm } from 'react-hook-form';
import FormProvider from '@/components/react-hook-form/FormProvider';
import RHFTextField from '@/components/react-hook-form/RHFTextField';
import FormSectionWrapper from '@/components/react-hook-form/FormSectionWrapper';
import { FaDoorClosed, FaRegNewspaper } from 'react-icons/fa';
import RHFSelectAutoComplete from '@/components/react-hook-form/RHFSelectAutoComplete';
import useSWR from 'swr';
import { getFetcher } from '@/utils/getFetcher';
import { useParams } from 'react-router';
import { API_PRODUCT } from '@/routes/path';
import { BaseResponse } from '@/_types/_bsResponse';
import RHFNumField from '@/components/react-hook-form/RHFNumField';
import { IoIosPricetag } from 'react-icons/io';
import { AiFillPicture } from 'react-icons/ai';
import RHFSwitch from '@/components/react-hook-form/RHFSwitch';
import RHFSelect from '@/components/react-hook-form/RHFSelect';
import RHFDatePicker from '@/components/react-hook-form/RHFDatePicker';
import { useEffect } from 'react';
import RHFUpload from '@/components/react-hook-form/RHFUpload';
import RHFColor from '@/components/react-hook-form/RHFColor';
import RHFTagsInput from '@/components/react-hook-form/RHFTagsInput';
import InfoCKEditor from '@/components/InfoCKEditor';
import RHFCKEditor from '@/components/react-hook-form/RHFCKText';
import useSWRMutation from 'swr/mutation';
import { postFetcher } from '@/utils/postFetcher';
import toast from 'react-hot-toast';
import { ResProduct } from '@/_types/product/_product';
import RHFImage from '@/components/react-hook-form/RHFImage';
import ProductFormSkeleton from '@/components/ProductFormSkeleton';
import ProgressButton from '@/components/ProgressButton';
import { useProgress } from '@/hooks/useProgress';

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
export default function EditProductPage() {
  const { progressPercentage, setProgressPercentage, resetProgress } = useProgress();

  //form data post
  const {
    trigger,
    error,
    isMutating: isEditLoading,
  } = useSWRMutation(API_PRODUCT.UPDATE_PRODUCT, postFetcher);

  // get category data
  const {
    data: categoryData,
    error: categoryError,
    isLoading: isLoadingCategory,
  } = useSWR<BaseResponse<CategoryResponse>>(
    API_PRODUCT.GET_PRODUCT_CATEGORY,
    getFetcher<CategoryResponse>,
  );
  // get group data
  const {
    data: groupData,
    error: groupError,
    isLoading: isLoadingGroup,
  } = useSWR<BaseResponse<GroupResponse>>(
    API_PRODUCT.GET_PRODUCT_GROUP,
    getFetcher<GroupResponse>,
  );

  // get product Data
  let { productId } = useParams();
  const {
    data: formData,
    error: formError,
    isLoading: isLoadingFormData,
  } = useSWR<BaseResponse<ResProduct>>(
    `${API_PRODUCT.GET_PRODUCT}?id=${productId}`,
    getFetcher<ResProduct>,
  );

  const productData = formData?.data;

  // RHF
  const methods = useForm<EditProductType>({
    mode: 'onChange',
    resolver: yupResolver(EditProductSchema),
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
  const endTime = methods.watch('discount_end_time');

  // set data of date to one hours later of start time
  useEffect(() => {
    if (!startTime) return;

    if (startTime + 60 * 60 * 1000 > endTime!) {
      methods.setValue('discount_end_time', startTime + 60 * 60 * 1000, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [startTime, methods.setValue]);

  // fill form with back data
  useEffect(() => {
    if (!productData) return;

    methods.reset({
      id: productData.id,
      name: productData.name,
      en_name: productData.en_name,

      accCode: productData.accCode,

      brand: productData.brand,

      category: productData.category,
      subCategory_id: productData.subCategory,

      color_name: productData.color_name,
      color_code: productData.color_code,

      opening_type: productData.opening_type,

      material: productData.material,
      height: productData.height,
      width: productData.width,

      price: Number(productData.price.replaceAll(',', '')),

      inventory: productData.inventory,
      warehouseInventory: productData.warehouseInventory,
      minSalesCount: productData.minSalesCount,

      hasDiscount: Number(productData.discount) > 0,
      discount: productData.discount,

      discount_start_time: productData.discount_start_time
        ? productData.discount_start_time * 1000
        : undefined,

      discount_end_time: productData.discount_end_time
        ? productData.discount_end_time * 1000
        : undefined,

      image: productData.image,
      secondary_image: productData.secondary_image,

      
      oldImages: productData.images ?? [],
      tags: productData.tags,

      shortDescription: productData.shortDescription,
      description: productData.description,
    });
  }, [productData, methods]);

  // filter group based on category
  const filteredGroup = groupData?.data?.filter((group) => group.parent === categoryId);

  const submitHandler = async (data: EditProductType) => {
    const formData = new FormData();

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

      if (key === 'oldImages') {
        data.oldImages?.forEach((image, index) => {
          if (image) {
            formData.append(`oldImages[${index}]`, image.image);
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

      toast.success('محصول با موفقیت ویرایش شد');
      resetProgress();
    } catch (error) {
      toast.error('مشکلی پیش آمده است');
      resetProgress();
    }
  };

  if (isLoadingFormData)
    return (
      <div className="mx-auto mt-6 flex size-full w-full flex-col px-6">
        <ProductFormSkeleton />
      </div>
    );

  return (
    <Page title="ویرایش محصول آماده" disableHeaderTitle>
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

              <div className="flex w-full flex-col items-stretch gap-8 2xl:flex-row">
                <RHFUpload name="images" multiple={true} />

                {<RHFImage name="oldImages" />}
              </div>
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
                <RHFCKEditor name="description" labelText="توضیحات محصول" />
              </div>
              <div className="mr-auto mt-8 flex justify-end">
                <ProgressButton
                  progressPercentage={progressPercentage}
                  isLoading={isEditLoading}
                >
                  ویرایش محصول
                </ProgressButton>
              </div>
            </FormSectionWrapper>
          </div>
        </FormProvider>
      </div>
    </Page>
  );
}

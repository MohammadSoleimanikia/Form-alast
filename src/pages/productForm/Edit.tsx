import Page from '@/components/Page';
import EditProductForm from '@/sections/product/EditProductForm';

export default function EditProductPage() {
  return (
    <Page title="ویرایش محصول آماده" disableHeaderTitle>
      <EditProductForm />
    </Page>
  );
}

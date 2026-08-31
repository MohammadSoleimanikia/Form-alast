type Image = {
  id: number;
  image: string;
};
export type ProductResponse = {
  type: null|any;
  id: number;
  en_name: string;
};
export type GroupResponse = {
  id: number;
  name: string;
  parent: number;
}[];
export type CategoryResponse = { id: number; name: string }[];

export type ResProduct = {
  accCode: string;
  brand: string;
  category: number;
  color_code: string;
  color_name: string;
  created_at: string;
  description: string;
  discount: number;
  discount_end_time: null;
  discount_start_time: null;
  en_name: string;
  height: number;
  id: number;
  image: string;
  images: Image[];
  inventory: number;
  material: string;
  minSalesCount: number;
  name: string;
  opening_type: number;
  price: string;
  secondary_image: string;
  shortDescription: string;
  status: number;
  subCategory: number;
  tags: string[];
  updated_at: string;
  warehouseInventory: number;
  width: number;
};

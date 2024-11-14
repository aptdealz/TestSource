export interface Enquiry {
  enquiryId: string;
  sellerProductId: string;
  name: string;
  quantity: number;
  phoneNumber: string;
  description: string;
  shippingAddress: string;
  createdDate: string;
  lastModifiedDate?: any;
  created: string;
  lastModified?: any;
  sellerProduct: SellerProduct;
  createdBy: string;
  lastModifiedBy?: any;
  isDeleted: boolean;
}

export interface EnquiryRequest {
  sellerProductId: string;
  name: string;
  quantity: number;
  phoneNumber: string;
  description: string;
  shippingAddress: string;
}
interface SellerProduct {
  sellerProductId: string;
  userId: string;
  title: string;
  image: string;
  shortDescription: string;
  description: string;
  specifications: string;
  rating: number;
  isTopSellerProduct: boolean;
  seoTitle?: any;
  h1Tag?: any;
  metaDescription?: any;
  sellerId?: any;
  sellerName?: any;
  categoryId: string;
  categoryName?: any;
  categoryImage?: any;
  subCategoryId: string;
  subCategoryName?: any;
  subCategoryImage?: any;
  createdBy?: any;
  created: string;
  lastModifiedBy: string;
  lastModified: string;
  isDeleted: boolean;
}
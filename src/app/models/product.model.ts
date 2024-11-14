export interface Product {
  
  sellerProductId: string;
  userId: string;
  title: string;
  image: string;
  shortDescription: string;
  description: string;
  specifications: string;
  rating: number;
  isTopSellerProduct: boolean;
  seoTitle: string;
  h1Tag: string;
  metaDescription: string;
  sellerId: string;
  sellerName: string;
  categoryId: string;
  categoryName: string;
  categoryImage: string;
  subCategoryId: string;
  subCategoryName: string;
  subCategoryImage: string;
  createdBy?: string;
  created: string;
  lastModifiedBy?: string;
  lastModified?: string;
  isDeleted: boolean;

  
}


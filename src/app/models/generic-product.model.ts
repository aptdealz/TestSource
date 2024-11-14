export interface GenericProduct {
  genericProductId: string;
  title: string;
  urlTitle: string;
  image: string;
  shortDescription: string;
  description: string;
  specifications: string;
  rating: number;
  seoTitle?: any;
  h1Tag?: any;
  metaDescription?: any;
  categoryId: string;
  categoryName: string;
  categoryImage: string;
  subCategoryId: string;
  subCategoryName: string;
  subCategoryImage: string;
  createdBy?: any;
  created: string;
  lastModifiedBy?: any;
  lastModified: string;
  isDeleted: boolean;
}
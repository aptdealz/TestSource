import { Subcategory } from "./subcategory.model";

export interface Category {
  categoryId: string;
  name: string;
  urlName: string;
  image: string;
  isTopCategory: boolean;
  isDeleted: boolean;
  seoTitle: string;
  h1Tag: string;
  metaDescription: string;
  created: string;
  lastModified: string;
}

export interface CategoryTree{
  categoryId: string;
  name: string;
  urlName: string;
  image: string;
  isTopCategory: boolean;
  seoTitle: string;
  h1Tag: string;
  metaDescription: string;
  subCategories: Subcategory[];
}

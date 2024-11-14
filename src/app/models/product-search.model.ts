export interface ProductSearch {
    Id: string;    
    title: string;
    image: string;
    shortDescription: string;
    description: string;
    specifications: string;
    rating: number;
    seoTitle: string;
    h1Tag: string;
    metaDescription: string;  
    categoryId: string;
    categoryName: string;
    categoryImage: string;
    subCategoryId: string;
    subCategoryName: string;
    subCategoryImage: string; 
    isDeleted: boolean;  
    sellerProductId:string;  
    genericProductId:string;
  }
export interface BuyerProfileRequest {
  buyerNo: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  building: string;
  street: string;
  state: string;
  city: string;
  district: string;
  countryId: number;
  pinCode: string;
  landmark?: string;
  gstin?: string;
  profilePhoto: string;
}

export interface SellerProfileRequest {
  fullName: string;
  email: string;
  phoneNumber: string;
  profilePhoto: string;
  alternativePhoneNumber: string;
  about?: string;
  buildingNumber: string;
  street: string;
  bannerImage: string;
  state: string;
  city: string;
  countryId: number;
  pinCode: string;
  landmark: string;
  billingAddresses: BillingAddress[];
  description: string;
  experience: string;
  areaOfSupply: string;
  gstin: string;
  pan: string;
  bankAccountNumber: string;
  branch: string;
  ifsc: string;
  documents: any[];
  categories: Category[];
}

interface Category {
  category: string;
  businessCategoryId: number;
  parentId: number;
  subCategories: string[];
}

interface BillingAddress {
  buildingNumber: string;
  street: string;
  state: string;
  city: string;
  countryId: number;
  pinCode: string;
  landmark: string;
}
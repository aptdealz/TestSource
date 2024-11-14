export interface signUpBuyer {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  firebaseVerificationId: string;
  latitude: number;
  longitude: number;
}

export interface signUpSeller {
  fullName: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  alternativePhoneNumber: string;
  email: string;
  building: string;
  street: string;
  city: string;
  state: string;
  landmark: string;
  district: string;
  pinCode: string;
  countryId: number;
  description: string;
  category: Category;
  experience: number;
  areaOfSupply: string;
  gstin: string;
  pan: string;
  bankAccountNumber: string;
  branch: string;
  ifsc: string;
  file: string;
  subCategoriesother?: any;
  categoryother?: any;
  documents: any[];
  acceptTerms: boolean;
}

interface Category {
  category: string;
  subCategories: string[];
}


export interface ResetPasswordRequest {
  email: string;
  token: string;
  password: string;
}
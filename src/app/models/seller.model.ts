import { Subscription } from "./subscription.model";

export interface Seller {
  userId: string;
  sellerNo: string;
  name: string;
  address: string;
  phoneNumber: string;
  email: string;
  profilePhoto: string;
  about: string;
  category: string;
  status: string;
  isActive: boolean;
  reviews: number;
  averageRating: number;
  averageRatingForProduct: number;
  isVerified: boolean;
  isTopSeller: boolean;
  totalProducts: number;
  bannerImage: string;
  createdDate: string;
  lastModifiedDate: string;
  created: string;
  lastModified: string;
  products?: SellerProduct[];
}
export interface PartnerDetail {
  fullName: string;
  sellerId: string;
  sellerNo: string;
  email: string;
  phoneNumber: string;
  profilePhoto: string;
  about?: any;
  alternativePhoneNumber: string;
  building: string;
  street: string;
  city: string;
  state: string;
  landmark: string;
  pinCode: string;
  countryId: number;
  maximumNoOfCategories: number;
  nationality: string;
  myActiveSubscription?: Subscription;
  companyProfile: CompanyProfile;
  bankInformation: BankInformation;
  billingAddresses: BillingAddress[];
  status: string;
  documents: any[];
  isActive: boolean;
  isNotificationMute: boolean;
  latitude?: any;
  longitude?: any;
  averageRating: number;
  averageRatingForProduct: number;
}

interface BillingAddress {
  buildingNumber: string;
  street: string;
  city: string;
  district?: any;
  state: string;
  pinCode: string;
  nationality: string;
  countryId: number;
  landmark: string;
}

interface BankInformation {
  gstin: string;
  pan: string;
  bankAccountNumber: string;
  branch: string;
  ifsc: string;
}

interface CompanyProfile {
  bannerImage: string;
  description: string;
  categories: Category[];
  experience: string;
  areaOfSupply: string;
  commissionRate: number;
  isTopSeller: boolean;
  isVerified: boolean;
}

interface Category {
  category: string;
  businessCategoryId: number;
  parentId: number;
  subCategories: string[];
}
interface SellerProduct {
  productId: string;
  title: string;
  image: string;
}

export interface CartOrder {
  gstin: string;
  isReseller: boolean;
  agreeGSTc: boolean;
  billingAddressBuilding: string;
  billingAddressCountry: number;
  billingAddressCity: string;
  billingAddressName: string;
  billingAddressState: string;
  billingAddressStreet: string;
  billingAddressPinCode: string;
  billingAddressLandmark: string;
  shippingAddressStreet: string;
  shippingAddressCountry: number;
  shippingAddressState: string;
  shippingAddressPinCode: string;
  shippingAddressName: string;
  shippingAddressCity: string;
  shippingAddressBuilding: string;
  shippingAddressLandmark: string;
}

export interface AddCartItemRequest {
  deliveryLocationPinCode: string;
  description: string;
  expectedDeliveryDate: string;
  genericProductId: string;
  needInsuranceCoverage: boolean;
  pickupProductDirectly: boolean;
  preferInIndiaProducts: boolean;
  preferredSourceOfSupply: string;
  quantity: number;
  status: number;
  totalPriceEstimation: number;
  unit: string;
  userId: string;
}

export interface CartItem extends AddCartItemRequest {
  cartId: string;
  genericProduct: GenericProduct;
}

interface GenericProduct {
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
  categoryName?: any;
  categoryImage?: any;
  subCategoryId: string;
  subCategoryName?: any;
  subCategoryImage?: any;
  createdBy?: any;
  created: string;
  lastModifiedBy?: any;
  lastModified: string;
  isDeleted: boolean;
}

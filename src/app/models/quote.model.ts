export interface Quote {
  quoteId: string;
  quoteNo: string;
  requirementId: string;
  requirementNo: string;
  requirementTitle: string;
  quantity: number;
  unit: string;
  validityDate: string;
  created: string;
  status: string;
  paymentStatus: string;
  buyerId: string;
  sellerId: string;
  netAmount: number;
  totalQuoteAmount: number;
}

export interface QuoteDetail {
  quoteId: string;
  quoteNo: string;
  requirementId: string;
  requirementNo: string;
  unitPrice: number;
  handlingCharges: number;
  shippingCharges: number;
  insuranceCharges: number;
  shippingPinCode: string;
  deliveryLocationPinCode: string;
  quantity: number;
  validityDate: string;
  country: string;
  comments: string;
  status: string;
  paymentStatus: string;
  sellerId: string;
  buyerId: string;
  requestedQuantity: number;
  unit: string;
  netAmount: number;
  totalQuoteAmount: number;
  requirementTitle: string;
  category: string;
  subCategories: string[];
  preferredSource: string;
  totalPriceEstimation: number;
  needInsuranceCoverage: boolean;
  pickupProductDirectly: boolean;
  preferInIndiaProducts: boolean;
  expectedDeliveryDate: string;
  productImage: string;
  countryId: number;
  countryName: string;
  isBuyerContactRevealed: boolean;
  isSellerContactRevealed: boolean;
  isReseller: boolean;
  sellerContact: SellerContact;
  buyerContact: BuyerContact;
}

interface BuyerContact {
  userId: string;
  buyerId: string;
  name: string;
  email: string;
  phoneNumber: string;
}

interface SellerContact {
  userId: string;
  sellerId: string;
  name: string;
  email: string;
  phoneNumber: string;
}


export interface SendQuoteRequest {
  unitPrice: number;
  quantity: number;
  handlingCharges: number;
  insuranceCharges: number;
  shippingCharges: number;
  shippingPinCode: string;
  validityDate: string;
  countryId: number;
  comments: string;
  requirementId: string;
}
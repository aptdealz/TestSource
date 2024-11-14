export interface Orders {
  orderId: string;
  requirementId: string;
  title: string;
  productDescription: string;
  pickupProductDirectly: boolean;
  quantity: number;
  unit: string;
  orderNo: string;
  isGrievancePeriodOver: boolean;
  orderStatus: number;
  paymentStatus: number;
  orderStatusDescr: string;
  paymentStatusDescr: string;
  paidAmount: number;
  trackingLink: string;
  created: string;
  expectedDelivery: string;
}

export interface OrderDetails {
  orderId: string;
  requirementId: string;
  quoteId: string;
  orderNo: string;
  quoteNo: string;
  image: string;
  title: string;
  productDescription: string;
  pickupProductDirectly: boolean;
  quantity: number;
  unit: string;
  quoteComments: string;
  requirementNo: string;
  shippingPincode: string;
  requestedQuantity: number;
  unitPrice: number;
  netAmount: number;
  handlingCharges: number;
  shippingCharges: number;
  insuranceCharges: number;
  country: string;
  totalAmount: number;
  expectedDelivery: string;
  orderStatus: number;
  paymentStatus: number;
  orderStatusDescr: string;
  paymentStatusDescr: string;
  paidAmount: number;
  sellerRating: number;
  productRating: number;
  isOrderCancelAllowed: boolean;
  isDeliveryConfirmedFromBuyer: boolean;
  isGrievancePeriodOver: boolean;
  created: string;
  gstin: string;
  isReseller: boolean;
  shipperNumber: string;
  lrNumber: string;
  billNumber: string;
  trackingLink: string;
  sellerContact: SellerContact;
  buyerContact: BuyerContact;
  buyerAddressDetails: BuyerAddressDetails;
  sellerAddressDetails: SellerAddressDetails;
  shippingAddressDetails: ShippingAddressDetails;
}

interface ShippingAddressDetails {
  name: string;
  building: string;
  street: string;
  state: string;
  city: string;
  pinCode: string;
  landmark: string;
  country?: any;
}

interface SellerAddressDetails {
  name: string;
  building?: any;
  street: string;
  state: string;
  city: string;
  pinCode: string;
  landmark: string;
  country: string;
}

interface BuyerAddressDetails {
  name: string;
  building: string;
  street: string;
  state: string;
  city: string;
  pinCode: string;
  landmark?: any;
  country: string;
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

export interface GetOrdersForSeller {
  orderId: string;
  orderNo: string;
  title: string;
  requirementId: string;
  productDescription: string;
  pickupProductDirectly: boolean;
  quantity: number;
  unit: string;
  orderStatus: number;
  isGrievancePeriodOver: boolean;
  paymentStatus: number;
  trackingLink: string;
  lrNumber: string;
  billNumber: string;
  shipperNumber: string;
  orderStatusDescr: string;
  paymentStatusDescr: string;
  unitPrice: number;
  netAmount: number;
  platFormCharges: number;
  sellerEarnings: number;
  paidAmount: number;
  shippedDate: string;
  created: string;
  createdDate: string;
  shippedDateStr: string;
  expectedDelivery: string;
}


export interface OrderUpdateRequest {
  orderId: string;
  status: number;
  shipperNumber: string;
  lrNumber: string;
  billNumber: string;
  trackingLink: string;
}

export interface CreateOrderForRevealContact {
  orderId: string;
  name: string;
  email: string;
  phoneNumber: string;
  amount: string;
}
export interface Subscription {
  userId: string;
  userNo: string;
  planName: string;
  userName: string;
  rankIndex: number;
  userSubscriptionPlanId: string;
  subscriptionPlanId: string;
  totalAmount: number;
  noOfBillingCycle: number;
  durationInMonths: number;
  planStartDate?: any;
  planEndDate?: any;
  nextChargeDate?: any;
  endedAt?: any;
  razorPaySubscriptionId: string;
  paymentURL: string;
  rpSubscriptionStates: number;
  status: string;
  createdDate: string;
  lastModifiedDate?: any;
  created: string;
  lastModified?: any;
  createdBy: string;
  lastModifiedBy?: any;
  isDeleted: boolean;
}

//UserSubscriptionPlanPayment/GetPaymentsBySubscriptionId response modal
export interface PaymentsBySubscriptionIdResponse {
  totalAmount: number;
  issuedAt: string;
  paidAt: string;
  cancelledAt?: any;
  expiredAt?: any;
  billing_Start: string;
  billing_End: string;
  amount_Paid: number;
  paymentMethod: string;
  cardUpiDetails: string;
  razorpayPaymentId: string;
  razorpayInvoiceId: string;
  rzpayInvoiceURL: string;
  rzpayStatus: string;
  taxAmount: number;
  taxable_Amount: number;
  gross_Amount: number;
  amount_Due: number;
  userPaymentId: string;
  userSubscriptionPlanId: string;
  nextChargeDate: string;
  subscriptionPlanId: string;
  planName: string;
  userNo: string;
  userName: string;
  createdDate: string;
  lastModifiedDate?: any;
  created: string;
  lastModified?: any;
  createdBy?: any;
  lastModifiedBy?: any;
  isDeleted: boolean;
}

export interface UserSubscriptionPlan {
  razorPaySubscriptionId: string;
  subscriptionPlanId: string;
  amountToPay: number;
  paymentURL: string;
}

export interface AllSubscription {
  basePlanId: string;
  rankIndex: number;
  planName: string;
  pricingInfo: PricingInfo[];
  planFeatures: PlanFeature[];
  isDeleted: boolean;
}

interface PlanFeature {
  subscriptionPlanFeatureId: string;
  featureKey: number;
  featureKeyVal: string;
  featureName: string;
  count: number;
  basePlanId: string;
}

interface PricingInfo {
  subscriptionPlanId: string;
  basePlanId: string;
  razorpayPlanId: string;
  durationInMonths: number;
  price: number;
  discountPrice: number;
  priceAfterDiscount: number;
  taxRateInPercentage: number;
  taxAmount: number;
  priceIncludingTax: number;
}
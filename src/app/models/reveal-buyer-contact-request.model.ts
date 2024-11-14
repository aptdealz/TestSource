export interface RevealBuyerContactRequest {
  requirementId: string;
  paymentStatus: number;
  razorPayOrderId: string;
  razorPaySignature: string;
  razorPayPaymentId: string;
}
export interface RevealBuyerContactResponse {
  userId: string;
  buyerId: string;
  name: string;
  email: string;
  phoneNumber: string;
}
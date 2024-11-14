export class RevealSellerContactRequest {
  public userId: string = '';
  public quoteId: string = '';
  public paymentStatus: number = 0;
  public razorPayOrderId: string = '';
  public razorPayPaymentId: string = '';
}

export interface RevealSellerRequest {
  quoteId: string;
  paymentStatus: number;
  razorPayOrderId: string;
  razorPaySignature: string;
  razorPayPaymentId: string;
}
export interface RevealSellerContactResponse {
  userId: string;
  sellerId: string;
  name: string;
  email: string;
  phoneNumber: string;
}
export interface paymentOrder {
  orderId: string;
  orderNo: string;
  razorpayOrderId: string;
}

export interface payment
{
  orderId: string,
  razorPayOrderId: string,
  razorPayPaymentId: string,
  paymentStatus: number,
  razorpaySignature: string
}
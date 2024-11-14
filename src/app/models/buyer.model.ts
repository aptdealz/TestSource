export interface BuyerResponse {
  isActive: boolean;
  fullName: string;
  buyerId: string;
  buyerNo: string;
  registeredOn: string;
  phoneNumber: string;
  profilePhoto: string;
  email: string;
  building: string;
  street: string;
  city: string;
  state: string;
  landmark?: any;
  pinCode: string;
  status: string;
  countryId: number;
  nationality: string;
  isNotificationMute: boolean;
  gstin?: any;
}
export interface User {
  id: string;
  fullName: string;
  email: string;
  phoneNumber?: any;
  roles: string[];
  isVerified: boolean;
  expieryDateTime: string;
  jwToken: string;
  refreshToken: string;
  loginTrackingKey: string;
}

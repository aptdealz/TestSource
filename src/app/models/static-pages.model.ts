export interface AboutResponse {
  about_us: string;
  about1: string;
  about2: string;
  about3: string;
  about4: string;
  about5: string;
  about6: string;
  about7: string;
  vision: string;
  mission: string;
  mission1: string;
  mission2: string;
  mission3: string;
  mission4: string;
  cors: string;
  testimonials: Testimonial[];
}

interface Testimonial {
  name: string;
  designation: string;
  message: string;
}

export interface ContactResponse {
  description: string;
  phoneNumber: string;
  email: string;
  address: string;
}

export interface ContactCommentRequest {
  name: string;
  email: string;
  phoneNumber: string;
  message: string;
  callBackScheduled: boolean;
  preferredDateAndTime: string;
  companyName: string;
  commentType: string;
}

export interface ContactCommentResponse {
  succeeded: boolean;
  message: string;
  errors?: any;
  data: string;
}
export interface HowWeWorks {
  steps: Step[];
}

interface Step {
  title: string;
  description: string;
}

export interface Pincode {
  division: string;
  region: string;
  block: string;
  state: string;
  district: string;
  country: string;
}

export interface tnc {
  id: string;
  privacyPolicy: string;
  tandC: string;
  retrunPolicy: string;
}
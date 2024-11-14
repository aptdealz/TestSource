export interface Grievance {
  grievanceNo: string;
  requirementId: string;
  requirementTitle: string;
  issueDescription: string;
  sellerName: string;
  buyerName: string;
  grievanceId: string;
  grievanceFromUserId: string;
  grievanceFromUserName: string;
  grievanceFrom: number;
  orderId: string;
  orderNo: string;
  grievanceType: number;
  grievanceTypeDescr: string;
  preferredSolution: string;
  enableResponseFromUser: boolean;
  status: number;
  statusDescr: string;
  orderDate: string;
  created: string;
  createdStr: string;
  documents: any[];
  grievanceResponses: any[];
}

export const GrievancesTypes: GrievanceType[] = [
  { title: 'OrderRelated', value: 0 },
  { title: 'DelayedDelivery', value: 1 },
  { title: 'PaymentRelated', value: 2 },
  { title: 'ManufactureDefect', value: 3 },
  { title: 'IncompleteProductDelivery', value: 4 },
  { title: 'WrongOrder', value: 5 },
];

export interface GrievanceType {
  title: string;
  value: number;
}


export interface GrievanceResponse {
  grievanceNo: string;
  requirementTitle: string;
  grievanceId: string;
  grievanceFromUserId: string;
  orderId: string;
  orderNo: string;
  grievanceType: number;
  grievanceTypeDescr: string;
  grievanceFromUserName: string;
  issueDescription: string;
  preferredSolution: string;
  enableResponseFromUser: boolean;
  status: number;
  statusDescr: string;
  createdDate: string;
  lastModifiedDate: string;
  created: string;
  lastModified: string;
}

export interface GrievanceRequest {
  orderId: string;
  grievanceType: number;
  issueDescription: string;
  preferredSolution: string;
  documents?: any;
}

export interface GrievanceSubmitRequest {
  response: string;
  grievanceId: string;
}
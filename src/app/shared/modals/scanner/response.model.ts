export class OperationResponse {
    code: number = 0;
    message: string = '';
    exceptionDetail: string = '';
    object: any = null;
}
export interface Transport {
    plates: string;
    slot: Slot;
  }
  
  export interface Slot {
    name: string;
    description: string;
}
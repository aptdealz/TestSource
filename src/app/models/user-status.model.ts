export interface UserStatus {
  loggedIn: boolean;
  role: string;
  buyer: boolean;
  seller: boolean;
}
export class LoggedOutStatus implements UserStatus {
  loggedIn = false;
  role = '';
  buyer = false;
  seller = false;
}

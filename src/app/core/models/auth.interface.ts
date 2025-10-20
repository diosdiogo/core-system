import { ICompany } from "./company.interface";
import { IUser } from "./user.interface";
import { IUserProfile } from "./userProfile.interface";

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface ILoginResponse {
  token: string;
  user: IUser;
  profile: IUserProfile;
  companies: ICompany[];
}

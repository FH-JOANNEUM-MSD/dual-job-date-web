import { UserType } from '../enum/userType';

export interface AuthenticationResponse {
  tokenType: string;
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
  isNew: boolean;
  userId: string;
  email: string;
  userType: UserType;
}

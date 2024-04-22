import {UserType} from "../enum/userType";

export interface RegisterUserInput {
  email: string;
  role: UserType;
  institutionId: number;
  academicProgramId: number;
  companyId: number | null;
}

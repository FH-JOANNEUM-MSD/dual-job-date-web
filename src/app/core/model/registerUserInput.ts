import {UserType} from "../enum/userType";

export interface RegisterUserInput {
  email: string | null;
  role: UserType;
  institutionId: number | null;
  academicProgramId: number | null;
  companyId: number | null;
}




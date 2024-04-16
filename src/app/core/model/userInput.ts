import {UserType} from './userType';
import {CompanyInput} from "./companyInput";


export interface UserInput {
  id: string | null;
  academicProgramId: number | null;
  institutionId: number | null;
  isActive: boolean;
  userType: UserType;
  isNew: boolean;
  email: string | null;
  company: CompanyInput;
}




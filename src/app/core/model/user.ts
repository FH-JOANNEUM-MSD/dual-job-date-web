import {CompanyInput} from "./companyInput";
import {UserType} from "../enum/userType";


export interface User {
  id: string | null;
  academicProgramId: number | null;
  institutionId: number | null;
  isActive: boolean;
  userType: UserType;
  isNew: boolean;
  email: string | null;
  company: CompanyInput;
}




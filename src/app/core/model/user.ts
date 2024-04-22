import {UserType} from "../enum/userType";
import {Company} from "./company";


export interface User {
  id: string | null;
  academicProgramId: number | null;
  institutionId: number | null;
  isActive: boolean;
  userType: UserType;
  isNew: boolean;
  email: string | null;
  company: Company;
}

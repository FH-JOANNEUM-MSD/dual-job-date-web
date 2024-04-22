import {UserType} from "../enum/userType";
import {Company} from "./company";
import {Institution} from "./institution";
import {AcademicProgram} from "./academicProgram";


export interface User {
  id: string | null;
  academicProgram: AcademicProgram | null;
  institution: Institution | null;
  isActive: boolean;
  userType: UserType;
  isNew: boolean;
  email: string | null;
  company: Company;
}

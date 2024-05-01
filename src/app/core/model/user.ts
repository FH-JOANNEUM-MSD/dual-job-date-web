import {UserType} from "../enum/userType";
import {Company} from "./company";
import {Institution} from "./institution";
import {AcademicProgram} from "./academicProgram";


export interface User {
  id: string;
  academicProgram: AcademicProgram;
  institution: Institution;
  isActive: boolean;
  userType: UserType;
  isNew: boolean;
  email: string;
  company: Company;
}

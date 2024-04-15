import {CompanyActivity} from './companyActivity';
import {User} from './user';
import {Address} from './address';
import {StudentCompany} from './studentCompany';
import {Activity} from './activity';
import {Institution} from './institution';
import {CompanyDetails} from './companyDetails';
import {AcademicProgram} from './academicProgram';


export interface Company {
  id: number;
  name: string | null;
  industry: string | null;
  logoBase64: string | null;
  website: string | null;
  isActive: boolean;
  userId: string | null;
  user: User;
  companyDetailsId: number | null;
  companyDetails: CompanyDetails;
  addresses: Array<Address> | null;
  activities: Array<Activity> | null;
  companyActivities: Array<CompanyActivity> | null;
  likers: Array<User> | null;
  studentCompanies: Array<StudentCompany> | null;
  academicProgram: AcademicProgram;
  academicProgramId: number;
  institution: Institution;
  institutionId: number;
}


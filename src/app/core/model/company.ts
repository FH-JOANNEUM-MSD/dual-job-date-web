import { AcademicProgram } from './academicProgram';
import { Address } from './address';
import { CompanyDetails } from './companyDetails';
import { Institution } from './institution';
import { User } from './user';
import { StudentCompany } from './studentCompany';
import { Activity } from './activity';

export interface Company {
  id: number;
  name: string;
  industry: string | null;
  logoBase64: string | null;
  website: string | null;
  isActive: boolean;
  academicProgram: AcademicProgram | null;
  institution: Institution | null;
  user: User | null;
  companyDetails: CompanyDetails | null;
  activities: Activity[];
  addresses: Address[];
  studentCompanies: StudentCompany[];
}

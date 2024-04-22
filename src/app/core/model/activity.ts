import { Company } from './company';
import { CompanyActivity } from './companyActivity';
import { Institution } from './institution';
import { AcademicProgram } from './academicProgram';

export interface Activity {
  id: number;
  name: string | null;
  companies: Array<Company> | null;
  companyActivities: Array<CompanyActivity> | null;
  academicProgram: AcademicProgram;
  academicProgramId: number;
  institution: Institution;
  institutionId: number;
}

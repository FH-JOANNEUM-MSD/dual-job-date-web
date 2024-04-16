import { Company } from './company';
import { StudentCompany } from './studentCompany';
import { UserType } from '../enum/userType';
import { Institution } from './institution';
import { AcademicProgram } from './academicProgram';

export interface User {
  id: string | null;
  userName: string | null;
  normalizedUserName: string | null;
  email: string | null;
  normalizedEmail: string | null;
  emailConfirmed: boolean;
  passwordHash: string | null;
  securityStamp: string | null;
  concurrencyStamp: string | null;
  phoneNumber: string | null;
  phoneNumberConfirmed: boolean;
  twoFactorEnabled: boolean;
  lockoutEnd: string | null;
  lockoutEnabled: boolean;
  accessFailedCount: number;
  isActive: boolean;
  userType: UserType;
  isNew: boolean;
  academicProgramId: number;
  academicProgram: AcademicProgram;
  institutionId: number;
  institution: Institution;
  company: Company;
  likes: Array<Company> | null;
  studentCompanies: Array<StudentCompany> | null;
}

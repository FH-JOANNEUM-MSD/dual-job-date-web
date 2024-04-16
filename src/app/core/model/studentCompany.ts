import {Company} from './company';
import {User} from './user';


export interface StudentCompany {
  id: number;
  studentId: string | null;
  student: User;
  companyId: number;
  company: Company;
  like: boolean;
}


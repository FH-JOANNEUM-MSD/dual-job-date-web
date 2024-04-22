import {Company} from './company';
import {User} from './user';
import {Activity} from './activity';
import {Institution} from './institution';
import {AcademicDegree} from '../enum/academicDegree';

export interface AcademicProgram {
  id: number;
  year: number;
  name: string | null;
  keyName: string | null;
  academicDegreeEnum: AcademicDegree;
  users: User[] | null;
  activities: Activity[] | null;
  companies: Company[] | null;
  institutionId: number;
  institution: Institution;
}

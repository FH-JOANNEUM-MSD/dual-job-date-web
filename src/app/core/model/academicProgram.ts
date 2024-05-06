import {Company} from './company';
import {User} from './user';
import {Institution} from './institution';
import {AcademicDegree} from '../enum/academicDegree';
import {Activity} from './activity';

export interface AcademicProgram {
  id: number;
  year: number;
  name: string;
  keyName: string;
  academicDegreeEnum: AcademicDegree;
  users: User[] | null;
  activities: Activity[] | null;
  companies: Company[] | null;
  institutionId: number;
  institution: Institution;
}

import {Company} from './company';
import {User} from './user';
import {Activity} from './activity';
import {Institution} from './institution';
import {AcademicDegree} from './academicDegree';


export interface AcademicProgram {
  id: number;
  year: number;
  name: string | null;
  keyName: string | null;
  academicDegreeEnum: AcademicDegree;
  users: Array<User> | null;
  activities: Array<Activity> | null;
  companies: Array<Company> | null;
  institutionId: number;
  institution: Institution;
}




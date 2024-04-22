import { Company } from './company';
import { Activity } from './activity';

export interface CompanyActivity {
  id: number;
  value: number;
  companyId: number;
  company: Company;
  activityId: number;
  activity: Activity;
}

import {User} from "./user";
import {Company} from "./company";

export interface Appointment {
  id: number;
  startTime: Date;
  endTime: Date;
  user: User;
  company: Company;
}

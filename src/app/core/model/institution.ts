import {User} from './user';
import {Address} from './address';

export interface Institution {
  id: number;
  name: string | null;
  keyName: string | null;
  website: string | null;
  addresses: Address[] | null;
  users: User[] | null;
}

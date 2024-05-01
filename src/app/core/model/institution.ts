import {User} from './user';
import {Address} from './address';

export interface Institution {
  id: number;
  name: string;
  keyName: string;
  website: string | null;
  addresses: Address[] | null;
  users: User[] | null;
}


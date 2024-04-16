import {User} from './user';
import {Address} from './address';


export interface Institution {
  id: number;
  name: string | null;
  keyName: string | null;
  website: string | null;
  addresses: Array<Address> | null;
  users: Array<User> | null;
}


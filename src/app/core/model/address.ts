import {Company} from './company';
import {Institution} from './institution';


export interface Address {
  id: number;
  street: string | null;
  buildingNumber: string | null;
  apartmentNumber: number | null;
  city: string | null;
  postalCode: string | null;
  country: string | null;
  floor: number | null;
  companyId: number | null;
  company: Company;
  institutionId: number | null;
  institution: Institution;
}


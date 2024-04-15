export interface CompanyInput {
  id: number;
  name: string | null;
  industry: string | null;
  logoBase64: string | null;
  website: string | null;
  isActive: boolean;
  academicProgramId: number;
  institutionId: number;
  userId: string | null;
}


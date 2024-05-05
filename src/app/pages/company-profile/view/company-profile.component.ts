import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CompanyService } from '../../../core/services/company.service';
import { Institution } from 'src/app/core/model/institution';
import { AcademicProgram } from 'src/app/core/model/academicProgram';
import { AcademicProgramService } from 'src/app/core/services/academic-program.service';
import { InstitutionService } from 'src/app/core/services/institution.service';
import { UserService } from 'src/app/core/services/user.service';
import { forkJoin, of } from 'rxjs';
import { Company } from 'src/app/core/model/company';
import { Address } from 'src/app/core/model/address';
import { Activity } from 'src/app/core/model/activity';

@Component({
  selector: 'app-company-profile',
  templateUrl: './company-profile.component.html',
  styleUrl: './company-profile.component.scss',
})
export class CompanyProfileComponent implements OnInit {
  isLoading = true;
  form = this.fb.group({
    name: this.fb.nonNullable.control('', {
      validators: [Validators.required],
    }),
    industry: this.fb.control<string | null>(null),
    website: this.fb.control<string | null>(null),
    shortDescription: this.fb.control<string | null>(null),
    location: this.fb.control<string | null>(null),
    jobDescription: this.fb.control<string | null>(null),
    contactPersonInCompany: this.fb.control<string | null>(null),
    contactPersonHRM: this.fb.control<string | null>(null),
    trainer: this.fb.control<string | null>(null),
    trainerTraining: this.fb.control<string | null>(null),
    trainerProfessionalExperience: this.fb.control<string | null>(null),
    trainerPosition: this.fb.control<string | null>(null),
    activities: this.fb.array([]),
  });

  institutions: Institution[] = [];
  academicPrograms: AcademicProgram[] = [];
  activities: Activity[] = [];

  logoBase64: string | null = null;
  cities: string[] = [];

  userId: string = '162ec6f8-cb9f-411d-a0ef-15c22ca68acb';
  companyId: number = 1;

  constructor(
    private fb: FormBuilder,
    private companyService: CompanyService,
    private userService: UserService,
    private academicProgramService: AcademicProgramService,
    private institutionService: InstitutionService
  ) {}

  ngOnInit(): void {
    this.loadNeededData();
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    //const input = this.getInputFromForm();

    /*this.companyService.updateCompany(input)
      .subscribe(
        result => {
          if (!result) {
            return;
          }
        }
      );*/
  }

  /* delete(): void {
     if (!this.) {
       return;
     }

     this.userService.deleteUser(this.userId)
       .subscribe(
         result => {
           if (!result) {
             return;
           }
           this.dialogRef.close(result);
         }
       );
   }*/

  private loadNeededData() {
    forkJoin({
      user: this.userId ? this.userService.getUserById(this.userId) : of(null),
      company: this.companyId
        ? this.companyService.getCompanyById(this.companyId)
        : of(null),
      institutions: this.institutionService.getInstitutions(),
      academicPrograms: this.academicProgramService.getAcademicPrograms(),
    }).subscribe((result) => {
      if (result.company) {
        this.initForm(result.company);
        this.extractCities(result.company.addresses);
      }
      if (result.academicPrograms) {
        this.academicPrograms = result.academicPrograms;
      }
      if (result.institutions) {
        this.institutions = result.institutions;
      }
      this.isLoading = false;
    });
  }

  // private getInputFromForm(): Company {
  //   return {};
  // }

  private initForm(company: Company) {
    this.form.patchValue({
      name: company.name,
      shortDescription: company.companyDetails?.shortDescription,
      industry: company.industry,
      jobDescription: company.companyDetails?.jobDescription,
      contactPersonInCompany: company.companyDetails?.contactPersonInCompany,
      contactPersonHRM: company.companyDetails?.contactPersonHRM,
      trainer: company.companyDetails?.trainer,
      trainerTraining: company.companyDetails?.trainerTraining,
      trainerPosition: company.companyDetails?.trainerPosition,
      trainerProfessionalExperience:
        company.companyDetails?.trainerProfessionalExperience,
      website: company.website,
    });
    this.logoBase64 = company.logoBase64;
    this.activities = company.activities;
  }

  protected get logoSrc(): string | null {
    return this.logoBase64 ? `data:image/png;base64,${this.logoBase64}` : null;
  }

  private extractCities(addresses: Address[]): void {
    this.cities = addresses.map((address) => address.city ?? '');
    const citiesString = this.cities.join(', ');
    this.form.patchValue({ location: citiesString });
  }
}

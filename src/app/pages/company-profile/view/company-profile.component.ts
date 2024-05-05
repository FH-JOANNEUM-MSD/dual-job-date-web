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
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    private institutionService: InstitutionService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('companyId');
      if (id !== null) {
        this.companyId = +id;
      } else {
        this.companyId = 0;
        console.error('Company ID is missing in the route parameters');
      }
    });
    this.loadNeededData();
  }

  updateStatus(): void {
    this.companyService
      .activateOrDeactivateCompany(this.companyId, false)
      .subscribe({
        next: (_) => {
          this.snackBar.open(
            'Das Unternehmen wurde erfolgreich als inaktiv gesetzt.',
            'Schließen',
            {
              duration: 3000,
              verticalPosition: 'top',
            }
          );
        },
        error: (err) => {
          this.snackBar.open(
            'Fehler beim Setzen des Status. Bitte versuchen Sie es erneut.',
            'Schließen',
            {
              duration: 3000,
              verticalPosition: 'top',
            }
          );
          console.error('Fehler beim Aktualisieren des Status:', err);
        },
      });
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

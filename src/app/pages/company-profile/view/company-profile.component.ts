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
import { SnackbarService } from 'src/app/services/snackbar.service';
import { TranslateService } from '@ngx-translate/core';

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
    cities: this.fb.control<string | null>(null),
    jobDescription: this.fb.control<string | null>(null),
    contactPersonInCompany: this.fb.control<string | null>(null),
    contactPersonHRM: this.fb.control<string | null>(null),
    trainer: this.fb.control<string | null>(null),
    trainerTraining: this.fb.control<string | null>(null),
    trainerProfessionalExperience: this.fb.control<string | null>(null),
    trainerPosition: this.fb.control<string | null>(null),
    activities: this.fb.array([]),
  });

  imageOpacity: number = 1;
  showUploadButton: boolean = false;

  institutions: Institution[] = [];
  academicPrograms: AcademicProgram[] = [];
  activities: Activity[] = [];
  locations: Address[] = [];

  logoBase64: string | null = null;
  cities: string[] = [];

  companyId: number = 0;

  constructor(
    private fb: FormBuilder,
    private companyService: CompanyService,
    private translateService: TranslateService,
    private route: ActivatedRoute,
    private snackBarService: SnackbarService
  ) {}

  ngOnInit(): void {
    this.loadNeededData();
  }

  updateStatus(): void {
    this.companyService
      .activateOrDeactivateCompany(this.companyId, false)
      .subscribe({
        next: (_) => {
          this.openSnackBarSuccess(
            this.translateService.instant(
              'companyProfilePage.snackBar.success.setInactive'
            )
          );
        },
        error: (err) => {
          this.openSnackBarError(
            this.translateService.instant(
              'companyProfilePage.snackBar.error.setInactive'
            )
          );
          console.error('Fehler beim Aktualisieren des Status:', err);
        },
      });
  }

  updateCompany(): void {
    if (this.form.valid) {
      const updatedCompany: Company = {
        ...(this.form.value as Company),
        logoBase64: this.logoBase64,
      };
      this.companyService.updateCompany(updatedCompany).subscribe({
        next: (_) => {
          this.openSnackBarSuccess(
            this.translateService.instant(
              'companyProfilePage.snackBar.success.updateCompany'
            )
          );
        },
        error: (error) => {
          this.openSnackBarError(
            this.translateService.instant(
              'companyProfilePage.snackBar.error.updateCompany'
            )
          );
          console.error('Failed to update company', error);
        },
      });
    } else {
      console.log('Form is not valid');
      this.form.markAllAsTouched();
    }
  }

  private openSnackBarError(message: string) {
    this.snackBarService.error(message);
  }
  private openSnackBarSuccess(message: string) {
    this.snackBarService.success(message);
  }

  private loadNeededData() {
    const idParam = this.route.snapshot.paramMap.get('companyId');
    this.companyId = Number(idParam);

    forkJoin({
      company: this.companyId
        ? this.companyService.getCompanyById(this.companyId)
        : of(null),
    }).subscribe((result) => {
      if (result.company && result.company.addresses) {
        this.initForm(result.company);
        this.extractCities(result.company.addresses);
      }
      this.isLoading = false;
    });
  }

  private initForm(company: Company) {
    this.logoBase64 = company.logoBase64;
    this.activities = company.activities ?? [];
    this.locations = company.addresses ?? [];
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
      cities: this.convertLocationsString(),
    });
  }

  protected get logoSrc(): string | null {
    return this.logoBase64 ? `data:image/png;base64,${this.logoBase64}` : null;
  }

  private extractCities(addresses: Address[]): void {}

  protected toggleImage() {
    this.showUploadButton = !this.showUploadButton;
    this.imageOpacity = this.imageOpacity === 1 ? 0.5 : 1;
  }
  onFileSelect(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.logoBase64 = e.target.result.split(',')[1];
        this.showUploadButton = false;
        this.imageOpacity = 1;
      };
      reader.onerror = (error) => {
        console.error('Error occurred while reading file:', error);
      };
      reader.readAsDataURL(file);
    }
  }
  private convertLocationsString(): string {
    return this.locations.map((location) => location.city).join(', ');
  }
}

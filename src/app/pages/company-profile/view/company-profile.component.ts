import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CompanyService} from '../../../core/services/company.service';
import {Company} from 'src/app/core/model/company';
import {ActivatedRoute} from '@angular/router';
import {SnackbarService} from 'src/app/services/snackbar.service';
import {TranslateService} from '@ngx-translate/core';
import {CompanyDetails} from "../../../core/model/companyDetails";
import {catchError, of, switchMap} from "rxjs";
import {Activity} from "../../../core/model/activity";
import {DialogService} from "../../../services/dialog.service";
import {AuthService} from '../../../services/auth.service';
import {UserType} from "../../../core/enum/userType";
import {getFormControlErrors} from "../../../utils/form-utils";

@Component({
  selector: 'app-company-profile',
  templateUrl: './company-profile.component.html',
  styleUrl: './company-profile.component.scss',
})
export class CompanyProfileComponent implements OnInit {
  isLoading = true;
  status = true;

  form = this.fb.group({
    name: this.fb.nonNullable.control<string>('', {
      validators: [Validators.required],
    }),
    logoBase64: this.fb.control<string | null>(null, {
      validators: [],
    }),
    teamPictureBase64: this.fb.control<string | null>(null, {
      validators: [],
    }),
    industry: this.fb.control<string | null>(null, {
      validators: [Validators.required],
    }),
    website: this.fb.control<string | null>(null, {
      validators: [Validators.required],
    }),
    shortDescription: this.fb.control<string | null>(null, {
      validators: [Validators.required],
    }),
    jobDescription: this.fb.control<string | null>(null, {
      validators: [Validators.required],
    }),
    contactPersonInCompany: this.fb.control<string | null>(null, {
      validators: [Validators.required],
    }),
    contactPersonHRM: this.fb.control<string | null>(null, {
      validators: [Validators.required],
    }),
    trainer: this.fb.control<string | null>(null, {
      validators: [Validators.required],
    }),
    trainerTraining: this.fb.control<string | null>(null, {
      validators: [Validators.required],
    }),
    trainerProfessionalExperience: this.fb.control<string | null>(null, {
      validators: [Validators.required],
    }),
    trainerPosition: this.fb.control<string | null>(null, {
      validators: [Validators.required],
    }),
    addresses: this.fb.control<string | null>(null, {
      validators: [Validators.required],
    }),
    activities: this.fb.array([]),
  });

  imageOpacity: number = 1;
  showUploadButton: boolean = false;

  companyId: number | null = null;
  protected readonly getFormControlErrors = getFormControlErrors;

  constructor(
    private fb: FormBuilder,
    private companyService: CompanyService,
    private translateService: TranslateService,
    private route: ActivatedRoute,
    private snackBarService: SnackbarService,
    private dialogService: DialogService,
    private authService: AuthService,
  ) {
  }

  get activities(): FormArray {
    return this.form.controls.activities as FormArray;
  }

  protected get logoSrc(): string | null {
    return this.form.controls.logoBase64.value
      ? `data:image/png;base64,${this.form.controls.logoBase64.value}`
      : null;
  }

  protected get teamPictureSrc(): string | null {
    return this.form.controls.teamPictureBase64.value
      ? `data:image/png;base64,${this.form.controls.teamPictureBase64.value}`
      : null;
  }

  ngOnInit(): void {
    this.loadNeededData();
  }

  openConfirmationDialog(): void {
    const userType = this.authService.getUserType();
    const data = {
      titleTranslationKey: "companyDialog.confirmChangeTitle",
      messageTranslationKey: "companyDialog.confirmCompanyInactiveMessage"
    };
    if (userType === UserType.Admin) {
      data.messageTranslationKey = "companyDialog.confirmAdminInactiveMessage";
    }
    const companyId = this.companyId;
    if (!companyId) {
      return;
    }

    this.dialogService.openConfirmDialog(data).pipe(
      switchMap(result => {
        if (!result) {
          return of(null);
        }
        return this.companyService
          .activateOrDeactivateCompany(companyId, false)
      }),
      catchError(error => {
        this.snackBarService.error(
          this.translateService.instant(
            'companyProfilePage.snackBar.error.setInactive'
          )
        );
        console.error('Fehler beim Aktualisieren des Status:', error);
        return of(null);
      })
    ).subscribe(result => {
      if (!result) {
        return;
      }
      this.status = false;
      this.snackBarService.success(
        this.translateService.instant(
          'companyProfilePage.snackBar.success.setInactive'
        )
      );
    });
  }

  updateCompany(): void {

    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    const input = this.getInputFromForm();

    this.companyService
      .updateCompany(input)
      .pipe(
        switchMap((result) => {
          const activities = this.form.controls.activities.value;
          if (!result || !activities) {
            return of(null);
          }

          return this.companyService.createCompanyActivities(
            this.activities.value
          );
        })
      )
      .subscribe({
        next: (_) => {
          this.snackBarService.success(
            this.translateService.instant(
              'companyProfilePage.snackBar.success.updateCompany'
            )
          );
        },
        error: (error) => {
          this.snackBarService.error(
            this.translateService.instant(
              'companyProfilePage.snackBar.error.updateCompany'
            )
          );
          console.error('Failed to update company', error);
        },
      });
  }

  onFileSelect(event: any, flag: boolean): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const base64Data = e.target.result.split(',')[1];

        if (!this.validateBase64Data(base64Data)) {
          console.error(
            'Error: Base64 data exceeds the allowed size or is invalid.'
          );
          this.handleOversizeFile();
          return;
        }

        this.form.controls[
          flag ? 'logoBase64' : 'teamPictureBase64'
          ].patchValue(base64Data);
        this.showUploadButton = false;
        this.imageOpacity = 1;
      };
      reader.onerror = (error) => {
        console.error('Error occurred while reading file:', error);
      };
      reader.readAsDataURL(file);
    }
  }

  handleOversizeFile() {
    this.snackBarService.error(
      this.translateService.instant(
        'companyProfilePage.snackBar.error.fileSize'
      )
    );
  }

  deleteImage(flag: boolean) {
    if (flag) {
      this.form.controls.logoBase64.patchValue('');
    } else {
      this.form.controls.teamPictureBase64.patchValue('');
    }
  }

  protected toggleImage() {
    this.showUploadButton = !this.showUploadButton;
    this.imageOpacity = this.imageOpacity === 1 ? 0.5 : 1;
  }

  private validateBase64Data(base64Data: string): boolean {
    return base64Data.length <= 65535;

  }

  private loadNeededData() {
    const idParam = this.route.snapshot.paramMap.get('companyId');
    this.companyId = Number(idParam);

    this.companyService.getCompanyById(this.companyId).subscribe((result) => {
      this.isLoading = false;
      if (!result) {
        return;
      }
      this.status = result.isActive;
      this.initForm(result);
    });
  }

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
      addresses: company.companyDetails?.addresses,
      logoBase64: company.logoBase64,
      teamPictureBase64: company.companyDetails?.teamPictureBase64,
    });

    this.activities.clear();

    company.activities?.forEach((activity) => {
      const answerGroup = this.createActivity(activity);
      this.activities.push(answerGroup);
    });
  }

  private createActivity(activity: Activity): FormGroup {
    return this.fb.group({
      name: this.fb.nonNullable.control(activity.name),
      id: this.fb.nonNullable.control(activity.id),
      value: this.fb.nonNullable.control(activity.value, Validators.required),
    });
  }

  private getInputFromForm(): CompanyDetails {
    return {
      name: this.form.controls.name.value,
      website: this.form.controls.website.value,
      industry: this.form.controls.industry.value,
      logoBase64: this.form.controls.logoBase64.value,
      shortDescription: this.form.controls.shortDescription.value,
      jobDescription: this.form.controls.jobDescription.value,
      contactPersonInCompany: this.form.controls.contactPersonInCompany.value,
      contactPersonHRM: this.form.controls.contactPersonHRM.value,
      trainer: this.form.controls.trainer.value,
      trainerTraining: this.form.controls.trainerTraining.value,
      trainerProfessionalExperience:
      this.form.controls.trainerProfessionalExperience.value,
      trainerPosition: this.form.controls.trainerPosition.value,
      teamPictureBase64: this.form.controls.teamPictureBase64.value,
      addresses: this.form.controls.addresses.value,
    };
  }
}

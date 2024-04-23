import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {CompanyService} from "../../../core/services/company.service";

@Component({
  selector: 'app-company-profile',
  templateUrl: './company-profile.component.html',
  styleUrl: './company-profile.component.scss',
})
export class CompanyProfileComponent implements OnInit {

  isLoading = true;
  form = this.fb.group({
    name: this.fb.nonNullable.control('', {
      validators: [Validators.required]
    }),
    industry: this.fb.control<string | null>(
      null,
    ),
    website: this.fb.control<string | null>(
      null,
    ),
    shortDescription: this.fb.control<string | null>(
      null,
    ),
    jobDescription: this.fb.control<string | null>(
      null,
    ),
    contactPersonInCompany: this.fb.control<string | null>(
      null,
    ),
    contactPersonHRM: this.fb.control<string | null>(
      null,
    ),
    trainer: this.fb.control<string | null>(
      null,
    ),
    trainerTraining: this.fb.control<string | null>(
      null,
    ),
    trainerProfessionalExperience: this.fb.control<string | null>(
      null,
    ),
    trainerPosition: this.fb.control<string | null>(
      null,
    ),
  });

  constructor(
    private fb: FormBuilder,
    private companyService: CompanyService
  ) {
  }

  ngOnInit(): void {
    // this.loadNeededData();
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

  /*private loadNeededData() {

    forkJoin({
      user: this.userId ? this.userService.getUserById(this.userId) : of(null),
      institutions: this.institutionService.getInstitutions(),
      academicPrograms: this.academicProgramService.getAcademicPrograms()
    }).subscribe(result => {
      if (result.user) {
        this.initForm(result.user);
      }
      if (result.academicPrograms) {
        this.academicPrograms = result.academicPrograms;
      }
      if (result.institutions) {
        this.institutions = result.institutions;
      }
      this.isLoading = false;
    })

  }*/

  /*  private getInputFromForm(): Company {

      return {

      }

    }

    private initForm(details: CompanyDetails) {
      this.form.patchValue({})
    }*/
}


import {Component, OnInit} from '@angular/core';
import {SnackbarService} from "../../../services/snackbar.service";
import {AppointmentService} from "../../../core/services/appointment.service";
import {DialogService} from "../../../services/dialog.service";
import {switchMap} from "rxjs/operators";
import {of} from "rxjs";
import {AbstractControl, FormBuilder, Validators} from "@angular/forms";
import {AcademicProgram} from "../../../core/model/academicProgram";
import {AcademicProgramService} from "../../../core/services/academic-program.service";
import {GenerateAppointmentModel} from "../../../core/model/generateAppointmentModel";
import * as moment from "moment";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  startDate = moment(Date.now());

  form = this.fb.group({
    academicProgram: this.fb.control<AcademicProgram | null>(
      null,
      {validators: [Validators.required]}
    ),
    startTime: this.fb.control<Date | null>(null,
      {validators: [Validators.required]}),
    endTime: this.fb.control<Date | null>(
      null,
      {validators: [Validators.required]}
    ),
  }, {validators: this.dateLessThan('startTime', 'endTime')});
  academicPrograms: AcademicProgram[] = [];
  isLoading = false;
  protected readonly Date = Date;

  constructor(
    private fb: FormBuilder,
    private snackBarService: SnackbarService,
    private appointmentService: AppointmentService,
    private academicProgramService: AcademicProgramService,
    private dialogService: DialogService,
    private translateService: TranslateService,
  ) {
  }

  ngOnInit() {
    this.loadNeededData();
  }

  generateAppointments() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }

    this.isLoading = true;


    this.dialogService.openConfirmDialog({
      messageTranslationKey: 'homePage.confirmGeneration',
      titleTranslationKey: "homePage.confirmGenerationTitle"
    }).pipe(
      switchMap(result => {
        if (!result) {
          return of(null);
        }
        const input = this.getInputFromForm();
        return this.appointmentService.generateAppointments(input);
      })
    )
      .subscribe(
        result => {
          if (!result) {
            this.snackBarService.error(this.translateService.instant('homePage.generationUnsuccessful'))
            return;
          }
          this.snackBarService.success(this.translateService.instant('homePage.generationSuccessful'))
        }
      )
  }

  private dateLessThan(startDateTime: string, endDateTime: string) {
    return (group: AbstractControl): { [key: string]: any } | null => {
      let start = moment(group.get(startDateTime)?.value);
      let end = moment(group.get(endDateTime)?.value);
      return start && end && end.isBefore(start) ? {'dateLessThan': true} : null;
    };
  }

  private loadNeededData() {

    this.academicProgramService.getAcademicPrograms()
      .subscribe(result => {
        if (!result) {
          return;
        }
        this.academicPrograms = result;
      })

  }

  private getInputFromForm(): GenerateAppointmentModel {
    return {
      endTime: this.form.controls.endTime.value!,
      startTime: this.form.controls.startTime.value!,
      academicProgramId: this.form.controls.academicProgram.value!.id,
      matchesPerResult: 6,
    }

  }
}

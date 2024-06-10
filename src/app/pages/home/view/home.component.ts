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
import {getFormControlErrors} from "../../../utils/form-utils";
import {OwlDateTimeIntl} from "@danielmoncada/angular-datetime-picker";

@Injectable()
export class DefaultIntl extends OwlDateTimeIntl {
  constructor(private translateService: TranslateService) {
    super();
    this.initTranslations();
  }

  initTranslations() {
    this.cancelBtnLabel = this.translateService.instant('dateTimePicker.cancelBtnLabel');
    this.setBtnLabel = this.translateService.instant('dateTimePicker.setBtnLabel');
    this.upSecondLabel = this.translateService.instant('dateTimePicker.upSecondLabel');
    this.upMinuteLabel = this.translateService.instant('dateTimePicker.upMinuteLabel');
    this.upHourLabel = this.translateService.instant('dateTimePicker.upHourLabel');
    this.downSecondLabel = this.translateService.instant('dateTimePicker.downSecondLabel');
    this.downMinuteLabel = this.translateService.instant('dateTimePicker.downMinuteLabel');
    this.downHourLabel = this.translateService.instant('dateTimePicker.downHourLabel');
    this.prevMonthLabel = this.translateService.instant('dateTimePicker.prevMonthLabel');
    this.nextMonthLabel = this.translateService.instant('dateTimePicker.nextMonthLabel');
    this.prevYearLabel = this.translateService.instant('dateTimePicker.prevYearLabel');
    this.nextYearLabel = this.translateService.instant('dateTimePicker.nextYearLabel');
    this.switchToMonthViewLabel = this.translateService.instant('dateTimePicker.switchToMonthViewLabel');
    this.switchToMultiYearViewLabel = this.translateService.instant('dateTimePicker.switchToMultiYearViewLabel');
  }
}


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  providers: [
    { provide: OwlDateTimeIntl, useClass: DefaultIntl },
  ],
})
export class HomeComponent implements OnInit {

  startDate = moment(Date.now());
  start = new Date(new Date().setMinutes(60, 0, 0));
  end = new Date(new Date().setMinutes(120, 0, 0));
  form = this.fb.group({
    academicProgram: this.fb.control<AcademicProgram | null>(
      null,
      {validators: [Validators.required]}
    ),
    startTime: this.fb.control<Date>(this.start,
      {validators: [Validators.required]}),
    endTime: this.fb.control<Date>(
      this.end,
      {validators: [Validators.required]}
    ),
  }, {validators: this.dateLessThan('startTime', 'endTime')});
  academicPrograms: AcademicProgram[] = [];
  isLoading = true;
  protected readonly getFormControlErrors = getFormControlErrors;

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
          if (result) {
            this.snackBarService.success(this.translateService.instant('homePage.generationSuccessful'))
            return;
          }
        }
      )
  }

  private dateLessThan(startDateTime: string, endDateTime: string) {
    return (group: AbstractControl): { [key: string]: any } | null => {
      let start = moment(group.get(startDateTime)?.value);
      let end = moment(group.get(endDateTime)?.value);
      return start && end && !end.isAfter(start) ? {'dateLessThan': true} : null;
    };
  }

  private loadNeededData() {

    this.academicProgramService.getAcademicPrograms()
      .subscribe(result => {
        this.isLoading = false;
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

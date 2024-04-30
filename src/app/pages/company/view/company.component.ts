import {Component, OnInit} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {UserType} from 'src/app/core/enum/userType';
import {UserService} from 'src/app/core/services/user.service';
import {User} from '../../../core/model/user';
import {Institution} from '../../../core/model/institution';
import {FormBuilder, Validators} from '@angular/forms';
import {AcademicProgram} from '../../../core/model/academicProgram';
import {InstitutionService} from '../../../core/services/institution.service';
import {AcademicProgramService} from '../../../core/services/academic-program.service';
import {forkJoin} from 'rxjs';
import {DialogService} from '../../../services/dialog.service';
import {CompanyService} from '../../../core/services/company.service';
import {CsvParserService} from 'src/app/services/csv-parser.service';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrl: './company.component.scss',
})
export class CompanyComponent implements OnInit {
  form = this.fb.group({
    institution: this.fb.nonNullable.control<Institution | null>(null, {
      validators: [Validators.required],
    }),
    academicProgram: this.fb.nonNullable.control<AcademicProgram | null>(null, {
      validators: [Validators.required],
    }),
  });

  dataSource = new MatTableDataSource<User>();
  displayedColumns: string[] = [
    'name',
    'email',
    'status',
    'industry',
    'companyWebsite',
    'actions',
  ];
  institutions: Institution[] = [];
  academicPrograms: AcademicProgram[] = [];

  isLoadingResults: boolean = true;
  userLoading = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private companyService: CompanyService,
    private institutionService: InstitutionService,
    private academicProgramService: AcademicProgramService,
    private dialogService: DialogService,
    private csvParser: CsvParserService
  ) {
  }

  ngOnInit() {
    this.loadNeededData();
    this.form.valueChanges.subscribe((_) => this.reloadUser());
  }

  openCompanyDialog(id?: string): void {
    this.dialogService.openCompanyDialog(id).subscribe();
  }

  updateStatus(user: User, event: MouseEvent): void {
    event.stopPropagation();

    this.companyService
      .activateOrDeactivateCompany(user.company.id, !user.company.isActive)
      .subscribe({
        next: (_) => {
          user.company.isActive = !user.company.isActive;
        },
      });
  }

  sendMail(user: User, event: MouseEvent) {
    event.stopPropagation();

    this.userService.generateUserCredentials(user.id).subscribe(
      result => {
        if (!result) {
          return;
        }
        this.userService.sendCredentials(user, result.password)
      });
  }

  onFileSelect(event: Event): void {
    const inputElement = event.target as HTMLInputElement;

    if (!inputElement.files || inputElement.files.length === 0) {
      return;
    }

    const file = inputElement.files[0];
    this.isLoadingResults = true;

    this.csvParser.parseExcel(file).subscribe(
      {
        next: (result) => {
          console.log('Parsed JSON Data:', result);
          inputElement.value = '';
          this.isLoadingResults = false;
        },
        error: (error) => {
          inputElement.value = '';
          this.isLoadingResults = false;
          // TODO show error somehow
          console.error('Error parsing file:', error);
        }
      }
    )
  }

  private loadNeededData() {
    forkJoin({
      users: this.userService.getUser(UserType.Company, 2, 2),
      institutions: this.institutionService.getInstitutions(),
      academicPrograms: this.academicProgramService.getAcademicPrograms(),
    }).subscribe((result) => {
      if (result.users) {
        this.dataSource.data = result.users;
      }
      if (result.academicPrograms) {
        this.academicPrograms = result.academicPrograms;
      }
      if (result.institutions) {
        this.institutions = result.institutions;
      }
      this.isLoadingResults = false;
    });
  }

  private reloadUser() {
    this.userLoading = true;

    const institutionId = this.form.controls.institution.value?.id ?? 1;
    const academicProgramId = this.form.controls.academicProgram.value?.id ?? 1;
    this.userService
      .getUser(UserType.Company, institutionId, academicProgramId)
      .subscribe((result) => {
        this.userLoading = false;

        if (!result) {
          return;
        }
        this.dataSource.data = result;
      });
  }
}

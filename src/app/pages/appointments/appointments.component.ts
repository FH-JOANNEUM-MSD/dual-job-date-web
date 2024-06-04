import {Component, OnInit} from '@angular/core';
import {CalendarEvent} from 'angular-calendar';
import {AppointmentService} from '../../core/services/appointment.service';
import {ActivatedRoute} from '@angular/router';

const colors = {
  primary: {
    primary: '#53851E',
    secondary: '#CDECAC',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrl: './appointments.component.scss',
})
export class AppointmentsComponent implements OnInit {
  viewDate: Date = new Date();
  dayStartHour = 6;
  dayEndHour = 20;
  events: CalendarEvent[] = [];

  companyId: number | null = null;
  isLoading = true;

  constructor(
    private appointmentService: AppointmentService,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    this.loadNeededData();
  }

  private loadNeededData() {
    this.companyId = Number(this.route.snapshot.paramMap.get('companyId'));
    this.appointmentService.getAppointments(this.companyId).subscribe((result) => {
      this.isLoading = false;
      if (!result) {
        return;
      }

      this.dayStartHour = result.reduce((result, current) => {
        const temp = new Date(current.startTime).getHours();
        if (temp < result) {
          return temp;
        }
        return result;
      }, 24) - 1;

      this.dayEndHour = result.reduce((result, current) => {
        const temp = new Date(current.startTime).getHours();
        if (temp > result) {
          return temp;
        }
        return result;
      }, 0) + 1;

      this.viewDate = result[0].startTime;
      this.events = result.map((appointment) => {
        return {
          start: new Date(appointment.startTime),
          end: new Date(appointment.endTime),
          title: `${appointment.user.firstName} ${appointment.user.lastName} (${appointment.user.email})`,
          color: {...colors.primary},
        };
      });
    });
  }
}

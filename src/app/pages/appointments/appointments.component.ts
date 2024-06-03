import { Component, OnInit } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import { AppointmentService } from '../../core/services/appointment.service';
import { ActivatedRoute } from '@angular/router';

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
  events: CalendarEvent[] = [];

  companyId: number | null = null;

  // TODO DATUM ANZEIGEN
  constructor(
    private appointmentService: AppointmentService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.loadNeededData();
  }

  private loadNeededData() {
    this.companyId = Number(this.route.snapshot.paramMap.get('companyId'));
    this.appointmentService.getAppointments().subscribe((result) => {
      if (!result) {
        return;
      }
      this.viewDate = result[0].startTime;
      this.events = result.map((appointment) => {
        return {
          start: new Date(appointment.startTime),
          end: new Date(appointment.endTime),
          title: appointment.student,
          color: { ...colors.primary },
        };
      });
    });
  }
}

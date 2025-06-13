import { Component } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarOptions } from '@fullcalendar/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { SharedDialogComponent } from '../../shared/dialog/shared-dialog.component';

@Component({
  selector: 'app-events-calendar',
  templateUrl: './events-calendar.component.html',
  styleUrls: ['./events-calendar.component.scss'],
  standalone: true,
  imports: [FullCalendarModule, CommonModule],
})
export class EventsCalendarComponent {
  constructor(private dialog: MatDialog) {}

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: window.innerWidth < 600
      ? { left: 'prev,next', center: 'title', right: '' }
      : { left: 'prev,next today', center: 'title', right: 'dayGridMonth,dayGridWeek,dayGridDay' },
    events: [
      { title: 'First Day of School', date: '2025-08-15', description: 'Welcome to a new year!' },
      { title: 'Field Trip: Zoo', date: '2025-09-10', location: 'City Zoo', description: 'Bring a lunch and wear comfortable shoes.' },
      { title: 'Parent-Teacher Conference', date: '2025-10-05', description: 'Sign up for a time slot.' },
      { title: 'Thanksgiving Break', date: '2025-11-25', description: 'No school this week.' },
      { title: 'Winter Concert', date: '2025-12-15', location: 'School Auditorium', description: 'Students perform holiday songs.' },
      { title: 'Spring Break', date: '2026-03-20', description: 'No school for spring break.' },
      { title: 'Last Day of School', date: '2026-05-30', description: 'Have a great summer!' },
      // Add more events as needed
    ],
    editable: false,
    selectable: false,
    eventClick: this.handleEventClick.bind(this),
    eventDidMount: (info) => {
      info.el.title = info.event.title;
    },
  };

  handleEventClick(arg: any) {
    const event = arg.event;
    this.dialog.open(SharedDialogComponent, {
      data: {
        title: event.title,
        content: `Date: ${event.start.toLocaleDateString()}${event.extendedProps.description ? '\nDescription: ' + event.extendedProps.description : ''}${event.extendedProps.location ? '\nLocation: ' + event.extendedProps.location : ''}`,
        showDefaultClose: true
      },
      width: '90vw',
      maxWidth: '400px',
      autoFocus: false,
      restoreFocus: false,
    });
  }
} 
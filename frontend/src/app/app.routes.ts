import { Route } from '@angular/router';
import { DisplayComponent } from './domain/pdf/display/display.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { EventsCalendarComponent } from './domain/events-calendar/events-calendar.component';

export const appRoutes: Route[] = [
    { path: 'parent-manual', component: DisplayComponent },
    { path: 'events', component: EventsCalendarComponent },
    { path: '', redirectTo: 'parent-manual', pathMatch: 'full' },
    { path: '**', component: NotFoundComponent },
  ];

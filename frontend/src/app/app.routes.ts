import { Route } from '@angular/router';
import { DisplayComponent } from './domain/pdf/display/display.component';

export const appRoutes: Route[] = [
    { path: 'main', component: DisplayComponent },
    { path: '', redirectTo: 'main', pathMatch: 'full' }
  ];

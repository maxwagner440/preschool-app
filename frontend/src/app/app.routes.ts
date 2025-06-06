import { Route } from '@angular/router';
import { DisplayComponent } from './domain/pdf/display/display.component';
import { NotFoundComponent } from './not-found/not-found.component';

export const appRoutes: Route[] = [
    { path: '', component: DisplayComponent },
    { path: '**', component: NotFoundComponent },
    // { path: '', redirectTo: 'main', pathMatch: 'full' }
  ];

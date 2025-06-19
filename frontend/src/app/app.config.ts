import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { FileUploadService } from './domain/pdf/file-upload.service';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ApiService } from './shared/service/api.service';
import { FileService } from './domain/admin/files/file.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideHttpClient(withFetch()),
    FileUploadService,
    BrowserAnimationsModule,
    ToastrModule,
    ApiService,
    FileService ,
  ],
};

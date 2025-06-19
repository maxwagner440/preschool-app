import { Injectable } from '@angular/core';
import { ApiService } from '../../../shared/service/api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  constructor(private api: ApiService) {}

  getFiles(): Observable<any> {
    return this.api.get('list-files');
  }

  downloadImage(key: string): Observable<any> {
    return this.api.get(`download-url?key=${encodeURIComponent(key)}`);
  }
}

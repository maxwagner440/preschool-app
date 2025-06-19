
import { Injectable } from '@angular/core';
import { ApiService } from '../../shared/service/api.service';

@Injectable({
  providedIn: 'root'
})
export class PdfService {
  constructor(private api: ApiService) {}

  saveFile(payload: { fileName: string, fileData: string, contentType: string }) {
    return this.api.post('pdf', payload);
  }
}

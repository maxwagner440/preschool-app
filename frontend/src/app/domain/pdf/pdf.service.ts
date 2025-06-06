// https://7fdwaoctn3.execute-api.us-east-2.amazonaws.com/Prod

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PdfService {
  constructor(private http: HttpClient) {}

  saveFile(
    payload: { fileName: string, fileData: string, contentType: string }) {
    return this.http.post('https://7fdwaoctn3.execute-api.us-east-2.amazonaws.com/Prod/pdf', payload);
  }
}

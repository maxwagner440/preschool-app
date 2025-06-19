import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
    // TODO: Make this configurable
  baseUrl = 'https://e3vfz5egai.execute-api.us-east-2.amazonaws.com/Prod';
  constructor(private http: HttpClient) {}

  get<T>(endpoint: string, params?: HttpParams | {[param: string]: string | string[]}, headers?: HttpHeaders): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${endpoint}`, { params, headers });
  }

  post<T>(endpoint: string, body: any, headers?: HttpHeaders): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}/${endpoint}`, body, { headers });
  }

  put<T>(endpoint: string, body: any, headers?: HttpHeaders): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}/${endpoint}`, body, { headers });
  }

  delete<T>(endpoint: string, headers?: HttpHeaders): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}/${endpoint}`, { headers });
  }
} 
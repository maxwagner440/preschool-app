import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  constructor(private http: HttpClient) {}

  /**
   * Step 1: Get a pre-signed URL from your Lambda API.
   * @param fileName - e.g., 'document.pdf'
   * @param contentType - e.g., 'application/pdf'
   */
  getPresignedUrl(fileName: string, contentType: string): Observable<{ signedUrl: string }> {
    const payload = { fileName, contentType };
    return this.http.post<{ signedUrl: string }>(
      `${environment.apiUrl}/generate-presigned-url`,
      payload
    );
  }

  /**
   * Step 2: Use the signed URL to upload the PDF directly to S3.
   * @param pdfBlob - The Blob data of the PDF file
   * @param signedUrl - Pre-signed URL returned from Lambda
   */
  async uploadPdfToS3(pdfBlob: Blob, signedUrl: string): Promise<void> {
    try{
      const response = await fetch(signedUrl, {
        method: 'PUT',
        headers: {
        'Content-Type': 'application/pdf'
      },
      body: pdfBlob
    });

    if (!response.ok) {
        throw new Error(`Upload failed with status: ${response.status}`);
      }

      console.log('Upload successful!');
    } catch (error) {
      console.error('Error uploading PDF to S3:', error);
    }
  }
}

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

interface UploadedFile {
  key: string;
  uploadedAt: string;
}

@Component({
  selector: 'app-file-list',
  imports: [CommonModule],
  templateUrl: './file-list.component.html',
  styleUrl: './file-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileListComponent { 
  // private http = inject(HttpClient);
  files: UploadedFile[] = [];
  loading = true;

  constructor(private _http: HttpClient) {


    this._http.get<UploadedFile[]>('/api/admin/files').subscribe({
      next: (files) => {
        this.files = files;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  download(key: string) {
    this._http.get<{ url: string }>(`/api/admin/files/download-url?key=${encodeURIComponent(key)}`)
      .subscribe(res => window.open(res.url, '_blank'));
  }
}


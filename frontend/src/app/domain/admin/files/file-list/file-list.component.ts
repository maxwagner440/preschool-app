import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileService } from '../file.service';

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
  files: UploadedFile[] = [];
  loading = true;

  constructor(private _fileService: FileService) {


    this._fileService.getFiles().subscribe({
      next: (files) => {
        this.files = files;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  download(key: string) {
    this._fileService.downloadImage(key).subscribe(res => window.open(res.url, '_blank'));
  }
}


import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileService } from '../file.service';
import { map, Observable, tap, timer, switchMap } from 'rxjs';
import { UploadedFile } from '../file.interface';



@Component({
  selector: 'app-file-list',
  imports: [CommonModule],
  templateUrl: './file-list.component.html',
  styleUrl: './file-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileListComponent { 
  files$!: Observable<UploadedFile[]>;
  loading = signal(true);
  isMobile = window.innerWidth <= 600;

  constructor(private _fileService: FileService) { }

  ngOnInit() {
    this.files$ = this.getFiles();
  }

  getFiles(): Observable<UploadedFile[]> {
    return timer(1000).pipe(
      switchMap(() => 
        this._fileService.getFiles().pipe(
          map((files: UploadedFile[]) => files.map(file => ({
            ...file,
            key: file.key.replace('uploads/', ''),
          }))),
          tap(() => this.loading.set(false))
        )
      )
    );
  }

  download(key: string) {
    const keyWithUploads = `uploads/${key}`;
    this._fileService.downloadImage(keyWithUploads).subscribe(res => window.open(res.url, '_blank'));
  }
}


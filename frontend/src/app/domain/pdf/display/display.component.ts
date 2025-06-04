import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { DocumentSignComponent } from '../document-sign/document-sign.component';



@Component({
  selector: 'app-display',
  imports: [PdfViewerModule, DocumentSignComponent],
  standalone: true,
  templateUrl: './display.component.html',
  styleUrl: './display.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DisplayComponent { 
  // zoom = 1.0;
  pdfUrl = '/assets/ParentManual25-26.pdf'; // Use your own path here!

  // ngOnInit() {
  //   if (window.innerWidth <= 600) {
  //     this.zoom = 1; // adjust to make it more readable on mobile
  //   }
  // }

}

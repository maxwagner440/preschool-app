import { ChangeDetectionStrategy, Component, AfterViewInit } from '@angular/core';
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
  pdfUrl = '/assets/ParentManual25-26.pdf'; // Use your own path here!

}

import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { DocumentSignComponent } from '../document-sign/document-sign.component';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-display',
  imports: [PdfViewerModule, DocumentSignComponent, NgxExtendedPdfViewerModule, CommonModule],
  standalone: true,
  templateUrl: './display.component.html',
  styleUrl: './display.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DisplayComponent { 
  // zoom = 1.0;
  pdfUrl = '/assets/ParentManual25-26.pdf'; // Use your own path here!
  currentPdfUrl = this.pdfUrl;
  currentPage = 1;
  isMobile = window.innerWidth <= 600 ? 'true' : 'false';
  height = window.innerWidth <= 600 ? '75vh' : '90vh';
  totalPages = 0;
  disablePrevious = false;
  disableNext = false;
  signedPdfBlobUrl: string | null = null;
  
  onPagesLoaded(event: any) {
    this.totalPages = event.pagesCount || 0;
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
    this.disablePagination(this.currentPage);
  }
  
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
    this.disablePagination(this.currentPage);
  }

  onPageChange(pageNumber: number) {
    this.currentPage = pageNumber;
    this.disablePagination(this.currentPage);
  }

  disablePagination(currentPage: number) {
    this.disablePrevious = currentPage === 1;
    this.disableNext = currentPage === this.totalPages;
  }

  // downloadOriginalPdf() {
  //     const link = document.createElement('a');
  //     link.href = this.pdfUrl; // or your actual static URL
  //     link.download = 'ParentManual25-26.pdf'; // desired filename
  //     link.target = '_blank'; // optional: opens in new tab (helpful for some browsers)
  //     link.click();
  // }

  onSignedPdfBlobUrl(signedPdfBlobUrl: string) {
    this.signedPdfBlobUrl = signedPdfBlobUrl;
    this.currentPdfUrl = this.signedPdfBlobUrl;
  }

}

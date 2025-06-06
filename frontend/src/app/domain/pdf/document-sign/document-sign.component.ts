import { Component, ElementRef, input, ViewChild } from '@angular/core';
import SignaturePad from 'signature_pad';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FileUploadService } from '../file-upload.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-document-sign',
  standalone: true,
  templateUrl: './document-sign.component.html',
  styleUrls: ['./document-sign.component.scss'],
  imports: [CommonModule, FormsModule]
})
export class DocumentSignComponent {
  @ViewChild('signaturePad', { static: false }) signaturePadElement!: ElementRef<HTMLCanvasElement>;
  signaturePad!: SignaturePad;

  showSignModal = false;
  signingParent = 1; // 1 or 2
  private initialized = false;

  signaturePad1!: string;
  signaturePad2!: string;

  pdfUrl = input.required<string>();

  parentFirstName: string = '';
  parentLastName: string = '';

  parent1Name: string = '';
  parent1Title: string = '';
  parent2Name: string = '';
  parent2Title: string = '';
  signaturePadError: boolean = false;
  // currentDate: string = new Date().toLocaleDateString();

  latestPdfBlob: Blob | null = null;

  subscription = new Subscription();

  constructor(private _fileUploadService: FileUploadService) {}

  openSignModal(number: number) {
    this.signingParent = number;
    this.showSignModal = true;
    this.initialized = false; // reset for re-initialization
   
  }
  
  closeSignModal() {
    this.showSignModal = false;
    this.parentFirstName = '';
    this.parentLastName = '';
    this.signaturePadError = false;
  }

  ngAfterViewChecked() {
    if (this.showSignModal && !this.initialized && this.signaturePadElement) {
      this.initializeSignaturePad();
      this.initialized = true;
    }
  }

  initializeSignaturePad() {
      const canvas = this.signaturePadElement.nativeElement;
      const context = canvas.getContext('2d')!;
  
      // Adjust for device pixel ratio
      const ratio = window.devicePixelRatio || 1;
      canvas.width = canvas.offsetWidth * ratio;
      canvas.height = canvas.offsetHeight * ratio;
      context.scale(ratio, ratio);
  
      this.signaturePad = new SignaturePad(canvas);
  }

  
  initSignaturePad(canvas: HTMLCanvasElement) {
    const cssWidth = canvas.offsetWidth;
    const desiredHeight = 120;
    const dpr = window.devicePixelRatio || 1;

    canvas.width = cssWidth * dpr;
    canvas.height = desiredHeight * dpr;
    canvas.style.width = cssWidth + 'px';
    canvas.style.height = desiredHeight + 'px';

    const context = canvas.getContext('2d')!;
    context.scale(dpr, dpr);

    this.signaturePad = new SignaturePad(canvas);
  }

  clearSignature() {
    this.signaturePad.clear();
  }

  clearAll() {
    this.clearSignature();
    this.signaturePad1 = '';
    this.signaturePad2 = '';
    this.parentFirstName = '';
    this.parentLastName = '';
  }


  sendPdfToS3(blob: Blob): void {
    this.subscription.add(
      this._fileUploadService.getPresignedUrl(
        `${this.parent1Name}-${this.parent2Name}.pdf`,
        'application/pdf'
      ).subscribe({
        next: async (response) => {
          console.log(response);
          console.log("Now uploading to S3")
          const result = await this._fileUploadService.uploadPdfToS3(blob, response.signedUrl);

          this.clearAll();
        },
        error: (error) => {
          console.error('Error uploading PDF to S3:', error);
        }
      })
    );
  }

  async saveSignatures() {
    
    if(this.signaturePad1 && this.signaturePad2) {
      this.createPdf().then(blob => {
        this.latestPdfBlob = blob;
        this.sendPdfToS3(blob);
      });
    }
   
    // this.sendPdfToS3(blob); 
  }

  downloadOriginalPdf() {
    if (this.latestPdfBlob) {
      const link = document.createElement('a');
      link.href = this.pdfUrl(); // or your actual static URL
      link.download = 'document.pdf'; // desired filename
      link.target = '_blank'; // optional: opens in new tab (helpful for some browsers)
      link.click();
      
      // const url = URL.createObjectURL(this.latestPdfBlob);
      // const link = document.createElement('a');
      // link.href = url;
      // link.download = 'signed-document.pdf';  
      // link.click();
    }
  }

  downloadSignedPdf() {
    if (this.latestPdfBlob) {
      const url = URL.createObjectURL(this.latestPdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'signed-document.pdf';  
      link.click();
    }
  }

  saveSignature() {
    if (
          this.signaturePad.isEmpty() ||
          !this.parentFirstName ||
          !this.parentLastName
        ) {
          this.signaturePadError = true;
          return;
        } else {
          this.signaturePadError = false;
        }
      
    if (this.signingParent === 1) {
      this.signaturePad1 = this.signaturePad.toDataURL();
    } else {
      this.signaturePad2 = this.signaturePad.toDataURL();
    }

    this.showSignModal = false;

    // if(this.signaturePad1 && this.signaturePad2) {
    //   this.createPdf().then(blob => {
    //     this.latestPdfBlob = blob;
    //     this.sendPdfToS3(blob);
    //   });
    // }
  }

  private async createPdf(): Promise<Blob> {
    const signature1DataUrl = this.signaturePad1;
    const signature2DataUrl = this.signaturePad2;
    const pdfBytes = await fetch(this.pdfUrl()).then(res => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(pdfBytes);

    const parent1SignatureBytes = await fetch(signature1DataUrl).then(res => res.arrayBuffer());
    const parent2SignatureBytes = await fetch(signature2DataUrl).then(res => res.arrayBuffer());
    const parent1Image = await pdfDoc.embedPng(parent1SignatureBytes);
    const parent2Image = await pdfDoc.embedPng(parent2SignatureBytes);

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const pages = pdfDoc.getPages();
    const lastPage = pages[pages.length - 1];

    // Parent 1
    lastPage.drawText(`Parent 1: ${this.parent1Name}`, {
      x: 50,
      y: 200,
      size: 12,
      font,
      color: rgb(0, 0, 0)
    });
    lastPage.drawText(`Title: ${this.parent1Title}`, {
      x: 50,
      y: 185,
      size: 10,
      font,
      color: rgb(0, 0, 0)
    });
    lastPage.drawImage(parent1Image, {
      x: 250,
      y: 190,
      width: 150,
      height: 30
    });

    // Parent 2
    lastPage.drawText(`Parent 2: ${this.parent2Name}`, {
      x: 50,
      y: 100,
      size: 12,
      font,
      color: rgb(0, 0, 0)
    });
    lastPage.drawText(`Title: ${this.parent2Title}`, {
      x: 50,
      y: 85,
      size: 10,
      font,
      color: rgb(0, 0, 0)
    });
    lastPage.drawImage(parent2Image, {
      x: 250,
      y: 90,
      width: 150,
      height: 30
    });

    // Date
    lastPage.drawText(`Date: ${new Date().toLocaleDateString()}`, {
      x: 50,
      y: 50,
      size: 12,
      font,
      color: rgb(0, 0, 0)
    });

    const signedPdfBytes = await pdfDoc.save();
    const blob = new Blob([new Uint8Array(signedPdfBytes)], { type: 'application/pdf' });
    return blob;
  }
}

import { ChangeDetectorRef, Component, ElementRef, input, output,  ViewChild, OnInit } from '@angular/core';
import { PDFDocument, PDFImage, rgb, StandardFonts } from 'pdf-lib';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FileUploadService } from '../file-upload.service';
import { Subscription } from 'rxjs';
import SignaturePad from 'signature_pad';


@Component({
  selector: 'app-document-sign',
  standalone: true,
  templateUrl: './document-sign.component.html',
  styleUrls: ['./document-sign.component.scss'],
  imports: [CommonModule, FormsModule]
})
export class DocumentSignComponent implements OnInit {
  pdfUrl = input.required<string>();
  enabled = input<boolean>(false);
  baseFileName = input<string>('ParentManual25-26');

  signedPdfBlobUrl = output<string>();

  originalPdfUrl!: string;

  @ViewChild('signaturePad', { static: false }) signaturePadElement!: ElementRef<HTMLCanvasElement>;
  @ViewChild('errorToast', { static: true }) errorToast!: ElementRef;

  parentOneImage: PDFImage | null = null;
  parentTwoImage: PDFImage | null = null;

  signaturePad!: SignaturePad;

  showSignModal = false;
  signingParent = 1; // 1 or 2
  private initialized = false;

  signaturePad1: string | undefined;
  signaturePad2: string | undefined;

  parentFormFirstName: string = '';
  parentFormLastName: string = '';

  parentOneFirstName: string = '';
  parentOneLastName: string = '';
  parentTwoFirstName: string = '';
  parentTwoLastName: string = '';
  
  signaturePadError: boolean = false;

  latestPdfBlob: Blob | null = null;

  showSuccessToast = false;
  showErrorToast = false;
  subscription = new Subscription();
  saving = false;
  constructor(private _fileUploadService: FileUploadService, private cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.originalPdfUrl = this.pdfUrl();
  }

  triggerSuccessToast() {
    this.showSuccessToast = true;
    this.cdr.detectChanges();
  }

  triggerErrorToast() {
    this.showErrorToast = true;
    this.cdr.detectChanges();
  }

  hideToast() {
    this.showSuccessToast = false;
    this.showErrorToast = false;
  }

  openSignModal(number: number) {
    if(this.enabled()) {
      this.signingParent = number;
      this.showSignModal = true;
      this.initialized = false; // reset for re-initialization
    }
  }
  
  closeSignModal() {
    this.showSignModal = false;
    this.parentFormFirstName = '';
    this.parentFormLastName = '';
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
    if(this.signaturePad) {
      this.signaturePad.clear();
    }
  }

  clearAll() {
    this.clearSignature();
    this.signaturePad1 = undefined;
    this.signaturePad2 = undefined;
    this.parentFormFirstName = '';
    this.parentFormLastName = '';
    this.parentOneFirstName = '';
    this.parentOneLastName = '';
    this.parentTwoFirstName = '';
    this.parentTwoLastName = '';
    this.signedPdfBlobUrl.emit(this.originalPdfUrl);

  }

  getFileName(parentOneLastName: string, parentTwoLastName: string) {
    return `${parentOneLastName}-${parentTwoLastName}.pdf`;
  }

  sendPdfToS3(blob: Blob): void {
    try {
      this.saving = true;
      this.subscription.add(
        this._fileUploadService.getPresignedUrl(
          this.getFileName(this.parentOneLastName, this.parentTwoLastName),
          'application/pdf'
        ).subscribe({
          next: async (response) => {
            try {
              await this._fileUploadService.uploadPdfToS3(blob, response.signedUrl);
              this.clearAll();
              this.triggerSuccessToast();
              this.saving = false;
              this.cdr.detectChanges();
            } catch (error) {
              this.saving = false;
              this.triggerErrorToast();
              console.error('Error uploading PDF to S3:', error);
              this.cdr.detectChanges();
            }
          },
          error: (error) => {
            this.saving = false;
            this.triggerErrorToast();
            console.error('Error uploading PDF to S3:', error);
            this.cdr.detectChanges();
          }
        })
      );
    } catch (error) {
      this.saving = false;
      console.error('Error uploading PDF to S3:', error);
      this.triggerErrorToast();
      this.cdr.detectChanges();
    }
}

  onSignatureComplete(signedPdfBlob: Blob) {
    this.signedPdfBlobUrl.emit(URL.createObjectURL(signedPdfBlob));
    this.latestPdfBlob = signedPdfBlob;
  }

  async saveSignatures() {
    if(this.latestPdfBlob) {
      this.sendPdfToS3(this.latestPdfBlob);
    }
  }

  downloadSignedPdf() {
    if (this.latestPdfBlob) {
      const url = URL.createObjectURL(this.latestPdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = this.getFileName(this.parentOneLastName, this.parentTwoLastName);  
      link.click();
    }
  }

  downloadOriginalPdf() {
    const link = document.createElement('a');
    link.href = this.originalPdfUrl;
    link.download = this.baseFileName() + '.pdf';
    link.click();
  }

  saveSignature() {
    this.signaturePadError = (
      this.signaturePad.isEmpty() ||
      !this.parentFormFirstName ||
      !this.parentFormLastName
    );
      
    if (this.signingParent === 1) {
      this.signaturePad1 = this.signaturePad.toDataURL();
      this.parentOneFirstName = this.parentFormFirstName;
      this.parentOneLastName = this.parentFormLastName;
      this.addSignaturesToPdf(this.signaturePad1, 1, this.parentFormFirstName, this.parentFormLastName);

    } else {
      this.signaturePad2 = this.signaturePad.toDataURL();
      this.addSignaturesToPdf(this.signaturePad2, 2, this.parentFormFirstName, this.parentFormLastName);
    }

    this.parentFormFirstName = '';
    this.parentFormLastName = '';
    this.showSignModal = false;
  }

  async addSignaturesToPdf(
    signatPadString: string,
    parentNumber: number,
    parentFirstName: string,
    parentLastName: string
  ) {
    const pdfBytes = this.latestPdfBlob
      ? await this.latestPdfBlob.arrayBuffer()
      : await fetch(this.pdfUrl()).then(res => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(pdfBytes);
  
    const parentSignatureBytes = await fetch(signatPadString).then(res => res.arrayBuffer());
    const parentImage = await pdfDoc.embedPng(parentSignatureBytes);
  
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const pages = pdfDoc.getPages();
    const lastPage = pages[pages.length - 1];
  
    const baseY = parentNumber === 1 ? 200 : 100;
    const lineY = baseY;
    const nameY = baseY + 20;
    const signatureY = baseY - 10;
  
    // Step 1: "Erase" the old signature area
    lastPage.drawRectangle({
      x: 45, // slightly larger than the signature area to fully cover it
      y: baseY - 15,
      width: 400,
      height: 60,
      color: rgb(1, 1, 1), // white rectangle to cover old content
    });
  
    // Step 2: Draw name
    lastPage.drawText(`${parentFirstName} ${parentLastName}`, {
      x: 50,
      y: nameY,
      size: 12,
      font,
      color: rgb(0, 0, 0),
    });
  
    // Step 3: Draw line
    lastPage.drawLine({
      start: { x: 50, y: lineY },
      end: { x: 400, y: lineY },
      thickness: 0.5,
      color: rgb(0, 0, 0),
    });
  
    // Step 4: Draw signature
    lastPage.drawImage(parentImage, {
      x: 150,
      y: signatureY,
      width: 150,
      height: 30,
    });
  
    // Step 5: Draw date
    const today = new Date();
    const formattedDate = today.toLocaleDateString();
    lastPage.drawText(formattedDate, {
      x: 420,
      y: nameY,
      size: 10,
      font,
      color: rgb(0, 0, 0),
    });
  
    const signedPdfBytes = await pdfDoc.save();
    const blob = new Blob([new Uint8Array(signedPdfBytes)], { type: 'application/pdf' });
    this.onSignatureComplete(blob);
  }
  

}

import { AfterViewInit, Component, ElementRef, input, ViewChild } from '@angular/core';
import SignaturePad from 'signature_pad';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-document-sign',
  standalone: true,
  templateUrl: './document-sign.component.html',
  styleUrls: ['./document-sign.component.scss'],
  imports: [CommonModule, FormsModule]
})
export class DocumentSignComponent implements AfterViewInit {
  @ViewChild('signaturePad1', { static: false }) signaturePad1Element!: ElementRef<HTMLCanvasElement>;
  @ViewChild('signaturePad2', { static: false }) signaturePad2Element!: ElementRef<HTMLCanvasElement>;

  signaturePad1!: SignaturePad;
  signaturePad2!: SignaturePad;

  pdfUrl = input.required<string>();

  parent1Name: string = '';
  parent1Title: string = '';
  parent2Name: string = '';
  parent2Title: string = '';
  currentDate: string = new Date().toLocaleDateString();

  ngAfterViewInit() {
    this.initSignaturePad(this.signaturePad1Element.nativeElement, 1);
    this.initSignaturePad(this.signaturePad2Element.nativeElement, 2);
  }

  initSignaturePad(canvas: HTMLCanvasElement, padNumber: number) {
    const cssWidth = canvas.offsetWidth;
    const desiredHeight = 120;
    const dpr = window.devicePixelRatio || 1;

    canvas.width = cssWidth * dpr;
    canvas.height = desiredHeight * dpr;
    canvas.style.width = cssWidth + 'px';
    canvas.style.height = desiredHeight + 'px';

    const context = canvas.getContext('2d')!;
    context.scale(dpr, dpr);

    if (padNumber === 1) {
      this.signaturePad1 = new SignaturePad(canvas);
    } else {
      this.signaturePad2 = new SignaturePad(canvas);
    }
  }

  clearSignature(padNumber: number) {
    if (padNumber === 1) {
      this.signaturePad1.clear();
    } else {
      this.signaturePad2.clear();
    }
  }

  async saveSignatures() {
    if (
      this.signaturePad1.isEmpty() ||
      this.signaturePad2.isEmpty() ||
      !this.parent1Name ||
      !this.parent2Name
    ) {
      alert('Please provide both signatures and names.');
      return;
    }

    const signature1DataUrl = this.signaturePad1.toDataURL();
    const signature2DataUrl = this.signaturePad2.toDataURL();
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
    lastPage.drawText(`Date: ${this.currentDate}`, {
      x: 50,
      y: 50,
      size: 12,
      font,
      color: rgb(0, 0, 0)
    });

    const signedPdfBytes = await pdfDoc.save();
    const blob = new Blob([new Uint8Array(signedPdfBytes)], { type: 'application/pdf' });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'signed-document.pdf';
    link.click();
  }
}

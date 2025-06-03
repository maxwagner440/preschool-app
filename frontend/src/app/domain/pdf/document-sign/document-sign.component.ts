import { AfterViewInit, Component, ElementRef, input, ViewChild } from '@angular/core';
import SignaturePad from 'signature_pad';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

@Component({
  selector: 'app-document-sign',
  standalone: true,
  templateUrl: './document-sign.component.html',
  styleUrls: ['./document-sign.component.scss'],
  imports: []
})
export class DocumentSignComponent implements AfterViewInit {
  @ViewChild('signaturePad', { static: false }) signaturePadElement!: ElementRef<HTMLCanvasElement>;
  signaturePad!: SignaturePad;
  pdfUrl = input.required<string>();
  
  pdfBytes!: Uint8Array;

  ngAfterViewInit() {
    // (pdfjsLib as any).GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.269/pdf.worker.min.js';
    // this.initPdfViewer();
    this.initSignaturePad();
  }

  initSignaturePad() {
    this.signaturePad = new SignaturePad(this.signaturePadElement.nativeElement);
  }

  async saveSignature() {
    if (this.signaturePad.isEmpty()) {
      alert('Please provide a signature first.');
      return;
    }

    const signatureDataUrl = this.signaturePad.toDataURL();
  
    // Fetch the original PDF
    const pdfBytes = await fetch(this.pdfUrl()).then(res => res.arrayBuffer());
  
    // Load the PDF
    const pdfDoc = await PDFDocument.load(pdfBytes);
  
    // Embed the signature image
    const pngImageBytes = await fetch(signatureDataUrl).then(res => res.arrayBuffer());
    const pngImage = await pdfDoc.embedPng(pngImageBytes);
 

    // 4️⃣ Get the last page
    const pages = pdfDoc.getPages();
    const lastPage = pages[pages.length - 1];

          
    // 4️⃣ Embed a font
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // 5️⃣ Define signature line position
    const lineX = 50;
    const lineY = 100;
    const currentDate = new Date().toLocaleDateString();

    // 6️⃣ Draw the signature line text
    lastPage.drawText(`Parent Signature: ______________________________________________      Date: ${currentDate}`, {
      x: lineX,
      y: lineY,
      size: 12,
      font: font,
      color: rgb(0, 0, 0)
    });

    // 7️⃣ Draw the signature image **exactly over the line**
    // Adjust the width/height to fit neatly on the line
    lastPage.drawImage(pngImage, {
      x: lineX + 140, // adjust to start of the line
      y: lineY - 5,   // slight adjustment to overlap the line
      width: 150,
      height: 30
    });

   
    const signedPdfBytes = await pdfDoc.save();
    const newUint8Array = new Uint8Array(signedPdfBytes);
    const blob = new Blob([newUint8Array], { type: 'application/pdf' });


    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'signed-document.pdf';
    link.click();


    // TODO: Save document to database OR send to google drive??
  }

  sendToApi(blob: Blob) {
    // TODO: Send document to api
    // NEEDS: Name of person, name of student?, date 
    const formData = new FormData();
    formData.append('file', blob, 'signed-document.pdf');

    // this.http.post('/api/upload-signed-pdf', formData).subscribe(
    //   response => console.log('Upload success:', response),
    //   error => console.error('Upload error:', error)
    // );
  }

  clearSignature() {
    this.signaturePad.clear();
  }

}

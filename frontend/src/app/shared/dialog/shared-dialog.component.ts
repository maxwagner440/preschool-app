import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-shared-dialog',
  template: `
    <h2 mat-dialog-title *ngIf="title">{{ title }}</h2>
    <mat-dialog-content>
      <ng-content></ng-content>
      <div *ngIf="content">{{ content }}</div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <ng-content select="[dialog-actions]"></ng-content>
      <button mat-button mat-dialog-close *ngIf="showDefaultClose">Close</button>
    </mat-dialog-actions>
  `,
  styles: [`
    mat-dialog-content { font-size: 1.1em; }
    h2 { margin-bottom: 0.5em; }
    @media (max-width: 600px) {
      :host ::ng-deep .mat-dialog-container {
        width: 100vw !important;
        max-width: 100vw !important;
        height: 100vh !important;
        margin: 0;
        border-radius: 0;
      }
    }
  `],
  standalone: true,
  imports: [MatDialogModule, CommonModule],
})
export class SharedDialogComponent {
  @Input() title?: string;
  @Input() content?: string;
  @Input() showDefaultClose = true;
  hasProjectedContent = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<SharedDialogComponent>
  ) {
    // Use injected data if inputs are not set
    if (data) {
      if (!this.title) this.title = data.title;
      if (!this.content) this.content = data.content;
      if (typeof data.showDefaultClose === 'boolean') this.showDefaultClose = data.showDefaultClose;
    }
  }

  ngAfterContentInit() {
    // Detect if ng-content is used
    this.hasProjectedContent = !!this.dialogRef.componentInstance;
  }
} 
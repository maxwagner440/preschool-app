import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class NavbarComponent {
  mobileMenuOpen = false;
  scrolled = false;

  constructor(private router: Router) {}

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.scrolled = window.scrollY > 10;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const menu = document.getElementById('mobileMenu');
    const hamburger = document.querySelector('.hamburger');
    if (menu && hamburger && !menu.contains(event.target as Node) && !hamburger.contains(event.target as Node)) {
      this.mobileMenuOpen = false;
    }
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    setTimeout(() => {
      const menu = document.getElementById('mobileMenu');
      if (menu) menu.classList.toggle('open', this.mobileMenuOpen);
    });
  }
  closeMobileMenu() {
    this.mobileMenuOpen = false;
    setTimeout(() => {
      const menu = document.getElementById('mobileMenu');
      if (menu) menu.classList.remove('open');
    });
  }
  navigateToParentManual() {
    this.router.navigate(['/parent-manual']);
  }
} 
import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-scroll-to-top-button',
  template: `
    <button class="scroll-to-top-button" (click)="scrollToTop()">
      <i class="fa fa-arrow-up"></i>
    </button>
  `,
  styles: [`
    .scroll-to-top-button {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 40px;
      height: 40px;
      border: none;
      border-radius: 50%;
      background-color: #007bff;
      color: #ffffff;
      font-size: 20px;
      cursor: pointer;
      display:flex!important;
      justify-content:center!important;
      align-items:center!important;
    }
  `]
})
export class ScrollToTopButtonComponent {
  @HostListener('window:scroll')
  onWindowScroll() {
    this.showOrHideButton();
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  showOrHideButton() {
    const button:any = document.querySelector('.scroll-to-top-button');
    if (button) {
      button.style.display = (window.pageYOffset > 100) ? 'block' : 'none';
    }
  }
}
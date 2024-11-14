import { Directive, ElementRef, Input, OnInit, inject } from '@angular/core';

// usage: <img appImage404 [defaultImage?]="'default_image_url'" src="image_url" />
@Directive({
  selector: 'img[appImage404]',
})
export class ImageMissingDirective implements OnInit {
  @Input() defaultImage = 'assets/images/image-404.png';

  private el = inject(ElementRef);

  ngOnInit() {
    const nativeElm: HTMLImageElement = this.el?.nativeElement;
    if (!nativeElm) return;
    nativeElm.onerror = () => {
      nativeElm.src = this.defaultImage;
      nativeElm.classList.remove('bg-loading');
    };
    nativeElm.onload = () => {
      nativeElm.classList.remove('bg-loading');
    };
  }
}

import { Component, Input, OnInit } from '@angular/core';
import { Autoplay, SwiperOptions } from 'swiper';
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from 'swiper';

// install Swiper modules
SwiperCore.use([Navigation, Autoplay, Pagination, Scrollbar, A11y]);
@Component({
  selector: 'app-image-tab-section',
  templateUrl: './image-tab-section.component.html',
  styleUrls: ['./image-tab-section.component.scss'],
})
export class ImageTabSectionComponent implements OnInit {
  @Input() banners:any=[]
  configTest: SwiperOptions = {
    slidesPerView: 2,
    spaceBetween: 50,
    autoplay: {
      delay: 2000,
      disableOnInteraction: false,
    },
    pagination: { clickable: true },
    scrollbar: { draggable: true },
    breakpoints: {
      0: {
        slidesPerView: 1,
        spaceBetween: 20,
      },
      720: {
        slidesPerView: 1,
        spaceBetween: 40,
      },
      1024: {
        slidesPerView: 2,
        spaceBetween: 50,
      },
    },
  };
  constructor() {}

  ngOnInit(): void {}
}

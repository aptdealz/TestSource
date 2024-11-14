import { Component, Input, OnInit } from '@angular/core';
import { Testimonial } from 'src/app/models/testimonial.model';
import { Autoplay, SwiperOptions } from 'swiper';
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from 'swiper';
SwiperCore.use([Navigation, Autoplay, Pagination, Scrollbar, A11y]);
@Component({
  selector: 'app-testimonial-section',
  templateUrl: './testimonial-section.component.html',
  styleUrls: ['./testimonial-section.component.scss'],
})
export class TestimonialSectionComponent implements OnInit {
  @Input('testimonials') testimonials: Testimonial[] = [];
  configTest: SwiperOptions = {
    slidesPerView: 3,
    spaceBetween: 50,
    autoplay: {
      delay: 2000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
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
        slidesPerView: 3,
        spaceBetween: 50,
      },
    },
  };
  constructor() {}

  ngOnInit(): void {}
}

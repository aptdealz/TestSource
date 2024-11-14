import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-related-product-section',
  templateUrl: './related-product-section.component.html',
  styleUrls: ['./related-product-section.component.scss'],
})
export class RelatedProductSectionComponent implements OnInit {
  @Input() loading: any;
  @Input() listOfOtherVendors: any;
  constructor() {}

  ngOnInit(): void {}
}

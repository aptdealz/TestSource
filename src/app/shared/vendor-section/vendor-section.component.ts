import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-vendor-section',
  templateUrl: './vendor-section.component.html',
  styleUrls: ['./vendor-section.component.scss'],
})
export class VendorSectionComponent implements OnInit {
  @Input() listVendor: any;
  @Input() loading: any;
  constructor() {}

  ngOnInit(): void {}

  getRandom3Products(array:any){
    const shuffled = array.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  }
}

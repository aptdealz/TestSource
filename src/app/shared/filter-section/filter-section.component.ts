import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-filter-section',
  templateUrl: './filter-section.component.html',
  styleUrls: ['./filter-section.component.scss'],
})
export class FilterSectionComponent implements OnInit {
  showPageValue: any = 10;
  @Output() showPageItem = new EventEmitter();
  constructor() {}

  ngOnInit(): void {
    this.setPageValue();
  }
  setPageValue() {
    this.showPageItem.emit(this.showPageValue);
  }
}

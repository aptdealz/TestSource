import { Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BreadcrumbItem } from 'src/app/models/generic/breadcrumb-item';

@Component({
  selector: 'app-breadcrumb-section',
  templateUrl: './breadcrumb-section.component.html',
  styleUrls: ['./breadcrumb-section.component.scss'],
})
export class BreadcrumbSectionComponent implements OnInit {
  @Input() breadcrumbs: BreadcrumbItem[] = [];
  constructor(public router: Router, private location: Location) {}

  ngOnInit(): void {}

  routeToPage(item: BreadcrumbItem) {
    if (item.back == '') {
      this.location.back();
    } else {
      this.router.navigateByUrl(item.path);
    }
  }
}

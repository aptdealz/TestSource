import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { Subject, takeUntil } from 'rxjs';
import { PageService } from 'src/app/services/page.service';
import { BreadcrumbItem } from 'src/app/models/generic/breadcrumb-item';
import {
  ContactCommentRequest,
  ContactCommentResponse,
  ContactResponse,
} from 'src/app/models/static-pages.model';
import { StaticPagesService } from 'src/app/services/static-pages.service';
@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss'],
})
export class ContactUsComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private meta = inject(Meta);
  private titleService = inject(Title);
  private page = inject(PageService);
  private spService = inject(StaticPagesService);

  private ngUnsubscribe$ = new Subject<void>();
  breadcrumbs: BreadcrumbItem[] = [
    { title: 'Home', path: '/' },
    { title: 'Contact Us', path: '' },
  ];
  commentTypes: any = [];
  pageTitle: string = 'Best B2B Online Portal for Buyer in India | Contact Us';
  data: any;
  today = new Date();
  contactForm = this.fb.group({
    name: ['', [Validators.required]],
    email: [
      '',
      [
        Validators.required,
        Validators.pattern(
          "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$"
        ),
      ],
    ],
    phoneNumber: [
      '',
      [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')],
    ],
    message: ['', [Validators.required]],
    callBackScheduled: [false],
    preferredDateAndTime: [null],
    companyName: [null, [Validators.required]],
    commentType: [null, [Validators.required]],
  });

  ngOnInit(): void {
    this.spService
      .getCommentTypes()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res) => {
          this.commentTypes = res;
        },
        error: (err: any) => {
          this.page.handleError(err);
        },
      });
    this.meta.updateTag({
      name: 'description',
      content:
        'Discover the ultimate B2B online portal for buyers in India. Explore a vast range of products and connect with reliable suppliers effortlessly! we are here for you. Contact us now.',
    });
    this.titleService.setTitle(this.pageTitle);
    this.spService
      .getContactUs()
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res: ContactResponse) => {
          this.data = res;
        },
        error: (err: any) => {
          this.page.handleError(err);
        },
      });
  }
  ngOnDestroy() {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
  submit() {
    this.page.showLoader();
    let payload: ContactCommentRequest = {
      name: this.contactForm.value.name || '',
      email: this.contactForm.value.email || '',
      phoneNumber: this.contactForm.value.phoneNumber || '',
      message: this.contactForm.value.message || '',
      callBackScheduled: this.contactForm.value.callBackScheduled || false,
      preferredDateAndTime: this.contactForm.value.preferredDateAndTime || '',
      companyName: this.contactForm.value.companyName || '',
      commentType: this.contactForm.value.commentType || '',
    };

    this.spService
      .sendContactMail(payload)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res: ContactCommentResponse) => {
          this.page.showSuccessToast('Your Enquiry is Submitted Successfully');
          this.contactForm.reset({});
          this.page.hideLoader();
        },
        error: (err: any) => {
          this.page.showErrorToast('Some error occoured');
          this.page.hideLoader();
          this.page.handleError(err);
        },
      });
  }

  oncallBackScheduledChange(event: any) {
    if (event.target.checked) {
      this.contactForm
        .get('preferredDateAndTime')
        ?.setValidators([Validators.required]);
    } else {
      this.contactForm.get('preferredDateAndTime')?.clearValidators();
    }
    this.contactForm.get('preferredDateAndTime')?.updateValueAndValidity();
  }

  get f() {
    return this.contactForm.controls;
  }
  allowPhoneNumberOnlyNumbers(event: any) {
    if(event.key == '+') return;
    const keyCode = event.keyCode || event.which;

    // Keycodes for number keys (0-9) from the main keyboard (48-57)
    const isMainKeyboardNumber = keyCode >= 48 && keyCode <= 57;

    // Keycodes for number pad keys (0-9) (96-105)
    const isNumberPadKey = keyCode >= 96 && keyCode <= 105;

    // Allow backspace, delete, tab, arrow keys (keycodes 8, 46, 9, 37-40)
    const isControlKey = keyCode === 8 || keyCode === 46 || keyCode === 9 ||
                        (keyCode >= 37 && keyCode <= 40);

    if (!isMainKeyboardNumber && !isNumberPadKey && !isControlKey) {
      event.preventDefault();  // Prevent any other key input
    }
   }
}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { SwiperModule } from 'swiper/angular';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { CategorySectionComponent } from './category-section/category-section.component';
import { CategoryCardComponent } from './category-card/category-card.component';
import { ProductSectionComponent } from './product-section/product-section.component';
import { ImageTabSectionComponent } from './image-tab-section/image-tab-section.component';
import { VendorSectionComponent } from './vendor-section/vendor-section.component';
import { CategoryFilterComponent } from './category-filter/category-filter.component';
import { EnquirySectionComponent } from './enquiry-section/enquiry-section.component';
import { RelatedProductSectionComponent } from './related-product-section/related-product-section.component';
import { BreadcrumbSectionComponent } from './breadcrumb-section/breadcrumb-section.component';
import { FilterSectionComponent } from './filter-section/filter-section.component';
import { SidebarMobileComponent } from './sidebar-mobile/sidebar-mobile.component';
import { LoginComponent } from './modals/login/login.component';
import { SignupComponent } from './modals/signup/signup.component';
import { ForgetComponent } from './modals/forget/forget.component';
import { PostRequirementComponent } from './modals/post-requirement/post-requirement.component';
import { PrintInputErrorComponent } from './print-input-error/print-input-error.component';
import { SellerRegistrationSuccessComponent } from './modals/seller-registration-success/seller-registration-success.component';
import { TestimonialSectionComponent } from './testimonial-section/testimonial-section.component';
import { ConfirmDialogComponent } from './modals/confirm-dialog/confirm-dialog.component';
import { BillingConfirmComponent } from './modals/billing-confirm/billing-confirm.component';
import { SendEnquiryComponent } from './modals/send-enquiry/send-enquiry.component';
import { CheckoutCongratsComponent } from './modals/checkout-congrats/checkout-congrats.component';
import { AddGrievanceComponent } from './modals/add-grievance/add-grievance.component';
import { SendQuotesComponent } from './modals/send-quotes/send-quotes.component';
import { FeaturedCardComponent } from './featured-card/featured-card.component';
import { CongratsPopupComponent } from './modals/congrats-popup/congrats-popup.component';
import { UpgradePlanComponent } from './modals/upgrade-plan/upgrade-plan.component';
import { ErrorHandleComponent } from './modals/error-handle/error-handle.component';
import { GenericFilterComponent } from './generic-filter/generic-filter.component';
import { LoadingComponent } from './loading/loading.component';

// pipes
import { BackgroundUrlPipe } from '../pipes/background-url.pipe';
import { CharacterLimitPipe } from '../pipes/character-limit.pipe';

// directives
import { ImageMissingDirective } from '../directives/image-missing.directive';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { SuccessPopupComponent } from './modals/success-popup/success-popup.component';
import { MultiSelectSearchDropdownComponent } from './multi-select-search-dropdown/multi-select-search-dropdown/multi-select-search-dropdown.component';
import { FileNameExtractorPipe } from '../pipes/file-name-extractor.pipe copy';
import { ConfirmPasswordDialogComponent } from './modals/confirm-password-dialog/confirm-password-dialog.component';
@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    CategorySectionComponent,
    CategoryCardComponent,
    ProductSectionComponent,
    ImageTabSectionComponent,
    VendorSectionComponent,
    CategoryFilterComponent,
    GenericFilterComponent,
    EnquirySectionComponent,
    RelatedProductSectionComponent,
    BreadcrumbSectionComponent,
    FilterSectionComponent,
    SidebarMobileComponent,
    LoginComponent,
    SignupComponent,
    ForgetComponent,
    PostRequirementComponent,
    PrintInputErrorComponent,
    SellerRegistrationSuccessComponent,
    TestimonialSectionComponent,
    ConfirmDialogComponent,
    ConfirmPasswordDialogComponent,
    BillingConfirmComponent,
    SendEnquiryComponent,
    CheckoutCongratsComponent,
    AddGrievanceComponent,
    SendQuotesComponent,
    FeaturedCardComponent,
    CongratsPopupComponent,
    UpgradePlanComponent,
    ErrorHandleComponent,
    LoadingComponent,
    BackgroundUrlPipe,
    CharacterLimitPipe,
    FileNameExtractorPipe,
    ImageMissingDirective,
    MultiSelectSearchDropdownComponent,
    SuccessPopupComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    SwiperModule,
    InfiniteScrollModule,
    MatButtonToggleModule,
    MatSortModule,
    MatTableModule,
    ZXingScannerModule,
    MatDialogModule,
    MatFormFieldModule,
    CdkAccordionModule,
    MatSelectModule,
    MatMenuModule,
    MatIconModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatTabsModule,
    MatExpansionModule
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    SwiperModule,
    InfiniteScrollModule,
    MatButtonToggleModule,
    MatSortModule,
    MatTableModule,
    ZXingScannerModule,
    HeaderComponent,
    FooterComponent,
    CategorySectionComponent,
    CategoryCardComponent,
    TestimonialSectionComponent,
    ProductSectionComponent,
    ImageTabSectionComponent,
    VendorSectionComponent,
    CategoryFilterComponent,
    GenericFilterComponent,
    EnquirySectionComponent,
    RelatedProductSectionComponent,
    BreadcrumbSectionComponent,
    FilterSectionComponent,
    SidebarMobileComponent,
    LoginComponent,
    SignupComponent,
    ForgetComponent,
    PostRequirementComponent,
    PrintInputErrorComponent,
    SellerRegistrationSuccessComponent,
    ConfirmDialogComponent,
    ConfirmPasswordDialogComponent,
    BillingConfirmComponent,
    SendEnquiryComponent,
    CheckoutCongratsComponent,
    AddGrievanceComponent,
    SendQuotesComponent,
    FeaturedCardComponent,
    UpgradePlanComponent,
    LoadingComponent,
    BackgroundUrlPipe,
    CharacterLimitPipe,
    FileNameExtractorPipe,
    ImageMissingDirective,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    CdkAccordionModule,
    MatSelectModule,
    MatMenuModule,
    MatIconModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatTabsModule,
    MatExpansionModule,
    NgSelectModule
  ],
})
export class SharedModule {}

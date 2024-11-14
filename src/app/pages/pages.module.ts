import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

import { PagesRoutingModule } from './pages-routing.module';
import { HomeComponent } from './home/home.component';
import { PagesComponent } from './pages.component';
import { VendorRegistrationComponent } from './vendor-registration/vendor-registration.component';
import { HowWeWorkComponent } from './how-we-work/how-we-work.component';
import { BlogsComponent } from './blogs/blogs.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { SubscriptionComponent } from './subscription/subscription.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { NeedHelpComponent } from './need-help/need-help.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { ReturnPolicyComponent } from './return-policy/return-policy.component';
import { TermsConditionComponent } from './terms-condition/terms-condition.component';
import { CategoriesComponent } from './categories/categories.component';
import { SubcategoriesComponent } from './subcategories/subcategories.component';
import { ProductsComponent } from './products/products.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { CartComponent } from './cart/cart.component';
import { OurPartnersComponent } from './our-partners/our-partners.component';
import { BlogDetailsComponent } from './blog-details/blog-details.component';
import { PartnerDetailsComponent } from './partner-details/partner-details.component';
import { RequirementListComponent } from './requirement-list/requirement-list.component';
import { SellerRequirementDetailsComponent } from './seller-requirement-details/seller-requirement-details.component';
import { ViewQuotesComponent } from './view-quotes/view-quotes.component';
import { QuoteDetailsComponent } from './quote-details/quote-details.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { SellerOrderDetailsComponent } from './seller-order-details/seller-order-details.component';
import { GrievanceDetailsComponent } from './grievance-details/grievance-details.component';
import { BuyerProfileComponent } from './buyer-profile/buyer-profile.component';
import { PersonalComponent } from './buyer-profile/personal/personal.component';
import { EnquiriesComponent } from './buyer-profile/enquiries/enquiries.component';
import { RequirenmentsComponent } from './buyer-profile/requirements/requirements.component';
import { QuotesComponent } from './buyer-profile/quotes/quotes.component';
import { OrderHistoryComponent } from './buyer-profile/order-history/order-history.component';
import { GrievanceComponent } from './buyer-profile/grievance/grievance.component';
import { PersonalSellerComponent } from './seller-profile/personal-seller/personal-seller.component';
import { RequirementSellerComponent } from './seller-profile/requirement-seller/requirement-seller.component';
import { LeadsComponent } from './seller-profile/leads/leads.component';
import { GrievanceSellerComponent } from './seller-profile/grievance-seller/grievance-seller.component';
import { SellerProfileComponent } from './seller-profile/seller-profile.component';
import { ShippingComponent } from './seller-profile/shipping/shipping.component';
import { QuotesSellerComponent } from './seller-profile/quotes-seller/quotes-seller.component';
import { GenericProductsComponent } from './generic-products/generic-products.component';
import { SellerEnquiriesComponent } from './seller-profile/sellerEnquiries/sellerEnquiries.component';
import { BuyerOrderDetailsComponent } from './buyer-order-details/buyer-order-details.component';
import { BuyerRequirementDetailsComponent } from './buyer-requirement-details/buyer-requirement-details.component';
import { MySubscriptionComponent } from './my-subscription/my-subscription.component';
import { MySubscriptionDetailsComponent } from './my-subscription-details/my-subscription-details.component';
import { GrievanceBuyerDetailsComponent } from './grievance-buyer-details/grievance-buyer-details.component';
import { GenericProductDetailsComponent } from './generic-product-details/generic-product-details.component';
import { CartModalComponent } from './cart-modal/cart-modal.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ProductSearchComponent } from './product-search/product-search.component';

@NgModule({
  declarations: [
    HomeComponent,
    PagesComponent,
    VendorRegistrationComponent,
    HowWeWorkComponent,
    BlogsComponent,
    AboutUsComponent,
    SubscriptionComponent,
    ContactUsComponent,
    NeedHelpComponent,
    PrivacyPolicyComponent,
    ReturnPolicyComponent,
    TermsConditionComponent,
    CategoriesComponent,
    SubcategoriesComponent,
    ProductsComponent,
    ProductDetailsComponent,
    CartComponent,
    OurPartnersComponent,
    BlogDetailsComponent,
    PartnerDetailsComponent,
    RequirementListComponent,
    SellerRequirementDetailsComponent,
    BuyerRequirementDetailsComponent,
    ViewQuotesComponent,
    QuoteDetailsComponent,
    CheckoutComponent,
    SellerOrderDetailsComponent,
    BuyerOrderDetailsComponent,
    GrievanceDetailsComponent,
    BuyerProfileComponent,
    PersonalComponent,
    EnquiriesComponent,
    RequirenmentsComponent,
    QuotesComponent,
    OrderHistoryComponent,
    GrievanceComponent,
    GrievanceSellerComponent,
    OrderHistoryComponent,
    QuotesComponent,
    LeadsComponent,
    RequirementSellerComponent,
    PersonalSellerComponent,
    SellerProfileComponent,
    ShippingComponent,
    QuotesSellerComponent,
    GenericProductsComponent,
    SellerEnquiriesComponent,
    MySubscriptionComponent,
    MySubscriptionDetailsComponent,
    GrievanceBuyerDetailsComponent,
    GenericProductDetailsComponent,
    CartModalComponent,
    NotFoundComponent,
    ProductSearchComponent,
  ],
  imports: [CommonModule, PagesRoutingModule, SharedModule],
})
export class PagesModule {}

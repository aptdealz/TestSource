import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from '../guards/auth-guard';
import { buyerRoleGuard, sellerRoleGuard } from '../guards/role-guard';
import { AboutUsComponent } from './about-us/about-us.component';
import { BlogDetailsComponent } from './blog-details/blog-details.component';
import { BlogsComponent } from './blogs/blogs.component';
import { BuyerProfileComponent } from './buyer-profile/buyer-profile.component';
import { EnquiriesComponent } from './buyer-profile/enquiries/enquiries.component';
import { GrievanceComponent } from './buyer-profile/grievance/grievance.component';
import { OrderHistoryComponent } from './buyer-profile/order-history/order-history.component';
import { PersonalComponent } from './buyer-profile/personal/personal.component';
import { QuotesComponent } from './buyer-profile/quotes/quotes.component';
import { RequirenmentsComponent } from './buyer-profile/requirements/requirements.component';
import { CartComponent } from './cart/cart.component';
import { CategoriesComponent } from './categories/categories.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { GenericProductsComponent } from './generic-products/generic-products.component';
import { GrievanceDetailsComponent } from './grievance-details/grievance-details.component';
import { HomeComponent } from './home/home.component';
import { HowWeWorkComponent } from './how-we-work/how-we-work.component';
import { NeedHelpComponent } from './need-help/need-help.component';
import { SellerOrderDetailsComponent } from './seller-order-details/seller-order-details.component';
import { OurPartnersComponent } from './our-partners/our-partners.component';
import { PagesComponent } from './pages.component';
import { PartnerDetailsComponent } from './partner-details/partner-details.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ProductsComponent } from './products/products.component';
import { QuoteDetailsComponent } from './quote-details/quote-details.component';
import { SellerRequirementDetailsComponent } from './seller-requirement-details/seller-requirement-details.component';
import { RequirementListComponent } from './requirement-list/requirement-list.component';
import { ReturnPolicyComponent } from './return-policy/return-policy.component';
import { GrievanceSellerComponent } from './seller-profile/grievance-seller/grievance-seller.component';
import { LeadsComponent } from './seller-profile/leads/leads.component';
import { PersonalSellerComponent } from './seller-profile/personal-seller/personal-seller.component';
import { QuotesSellerComponent } from './seller-profile/quotes-seller/quotes-seller.component';
import { RequirementSellerComponent } from './seller-profile/requirement-seller/requirement-seller.component';
import { SellerProfileComponent } from './seller-profile/seller-profile.component';
import { SellerEnquiriesComponent } from './seller-profile/sellerEnquiries/sellerEnquiries.component';
import { ShippingComponent } from './seller-profile/shipping/shipping.component';
import { SubcategoriesComponent } from './subcategories/subcategories.component';
import { SubscriptionComponent } from './subscription/subscription.component';
import { TermsConditionComponent } from './terms-condition/terms-condition.component';
import { VendorRegistrationComponent } from './vendor-registration/vendor-registration.component';
import { ViewQuotesComponent } from './view-quotes/view-quotes.component';
import { BuyerOrderDetailsComponent } from './buyer-order-details/buyer-order-details.component';
import { BuyerRequirementDetailsComponent } from './buyer-requirement-details/buyer-requirement-details.component';
import { MySubscriptionComponent } from './my-subscription/my-subscription.component';
import { MySubscriptionDetailsComponent } from './my-subscription-details/my-subscription-details.component';
import { GrievanceBuyerDetailsComponent } from './grievance-buyer-details/grievance-buyer-details.component';
import { GenericProductDetailsComponent } from './generic-product-details/generic-product-details.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ProductSearchComponent } from './product-search/product-search.component';

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'home', component: HomeComponent },
      { path: 'become-vendor', component: VendorRegistrationComponent },
      { path: 'how-we-work', component: HowWeWorkComponent },
      { path: 'blog', component: BlogsComponent },
      { path: 'about-us', component: AboutUsComponent },
      { path: 'subscription', component: SubscriptionComponent },
      { path: 'contact-us', component: ContactUsComponent },
      { path: 'need-help', component: NeedHelpComponent },
      { path: 'privacy-policy', component: PrivacyPolicyComponent },
      { path: 'terms-condition', component: TermsConditionComponent },
      { path: 'return-policy', component: ReturnPolicyComponent },
      { path: 'all-categories', component: CategoriesComponent },
      { path: ':type/categories', component: CategoriesComponent },
      { path: 'promoted-products', component: ProductsComponent },
      { path: 'product-details/:id', component: ProductDetailsComponent },
      { path: 'product/:id', component: GenericProductDetailsComponent },
      { path: 'product-search', component: ProductSearchComponent },
      {
        path: 'generic-product-details/:id',
        component: GenericProductDetailsComponent,
      },

      {
        path: 'cart',
        component: CartComponent,
        canActivate: [authGuard],
      },
      { path: 'our-partners', component: OurPartnersComponent },
      { path: 'our-partners/:id', component: OurPartnersComponent },
      { path: 'blog-details/:id', component: BlogDetailsComponent },
      { path: 'partner-details/:id', component: PartnerDetailsComponent },
      { path: 'product', component: GenericProductsComponent },
      {
        path: 'product/:category/:subcategory',
        component: GenericProductsComponent,
      },
      { path: 'generic-products', component: GenericProductsComponent },
      {
        path: 'requirement-list',
        component: RequirementListComponent,
      },
      {
        path: 'seller-requirement-details/:id',
        component: SellerRequirementDetailsComponent,
        canActivate: [authGuard],
      },
      {
        path: 'buyer-requirement-details/:id',
        component: BuyerRequirementDetailsComponent,
        canActivate: [authGuard],
      },
      { path: 'view-quotes/:id', component: ViewQuotesComponent,  canActivate: [authGuard], },
      { path: 'quote-details/:id', component: QuoteDetailsComponent,  canActivate: [authGuard], },
      { path: 'checkout', component: CheckoutComponent },
      { path: 'my-subscription', component: MySubscriptionComponent },
      {
        path: 'my-subscription-details/:id',
        component: MySubscriptionDetailsComponent,
        canActivate: [authGuard],
      },
      {
        path: 'seller-order-details/:id',
        canActivate: [sellerRoleGuard],
        component: SellerOrderDetailsComponent,
      },
      {
        path: 'buyer-order-details/:id',
        canActivate: [buyerRoleGuard],
        component: BuyerOrderDetailsComponent,
      },
      { path: 'grievance-details/:id', 
      component: GrievanceDetailsComponent ,
      canActivate: [authGuard,sellerRoleGuard],
    },
      {
        path: 'grievance-buyer-details/:id',
        component: GrievanceBuyerDetailsComponent,
        canActivate: [authGuard,buyerRoleGuard],
      },
       {
        path: 'buyer-profile',
        component: BuyerProfileComponent,
        data: {
          role: 'buyer',
        },
        children: [
          { path: 'personal', component: PersonalComponent },
          { path: 'enquiry', component: EnquiriesComponent },
          { path: 'requirements', component: RequirenmentsComponent },
          { path: 'quotes', component: QuotesComponent },
          { path: 'order-history', component: OrderHistoryComponent },
          { path: 'grievance', component: GrievanceComponent },
        ],
        canActivate: [buyerRoleGuard],
      },
      {
        path: 'seller-profile',
        component: SellerProfileComponent,
        data: {
          role: 'seller',
        },
        children: [
          { path: 'personal', component: PersonalSellerComponent },
          { path: 'requirements', component: RequirementSellerComponent },
          { path: 'leads', component: LeadsComponent },
          { path: 'quotes', component: QuotesSellerComponent },
          { path: 'shipping', component: ShippingComponent },
          { path: 'grievance', component: GrievanceSellerComponent },
          { path: 'enquiries', component: SellerEnquiriesComponent },
        ],
        canActivate: [sellerRoleGuard],
      },
      { path: 'category/:id', component: SubcategoriesComponent },
      { path: ':type/subcategories/:id', component: SubcategoriesComponent },

      { path: '404', component: NotFoundComponent },
      { path: '**', redirectTo: '/404', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}

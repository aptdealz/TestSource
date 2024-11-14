import { Component,OnDestroy, OnInit,Input,Output } from '@angular/core';
import { BreadcrumbItem } from 'src/app/models/generic/breadcrumb-item';
import { BannerService } from 'src/app/services/banner.service';
import { BannerResponse } from 'src/app/models/banner.model';
import { Page } from 'src/app/enums/page.enum';
import { Subject, takeUntil,forkJoin } from 'rxjs';
import { PageService } from 'src/app/services/page.service';
import { CategoryTree } from 'src/app/models/category.model';
import { Meta, Title } from '@angular/platform-browser';
import { SubcategoryService } from 'src/app/services/subcategory.service';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/models/product.model';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { ProductSearch } from 'src/app/models/product-search.model'
import { GenericProduct } from 'src/app/models/generic-product.model';



@Component({
  selector: 'app-product-search',
  templateUrl: './product-search.component.html',
  styleUrl: './product-search.component.scss'
})
export class ProductSearchComponent implements OnInit {  

  breadcrumbs: BreadcrumbItem[] = [
    { title: 'Home', path: '/' },
    { title: 'Product Search', path: '/product-search' },
    { title: '', path: '' },
  ];

  filterForm: any;
  filter: boolean = false;
  banners: BannerResponse[] = [];
  private ngUnsubscribe$ = new Subject<void>();
  categoryTree: CategoryTree[] = [];
  pageTitle: string = 'Products Search';
  list_sp: Product[] = [];
  list:ProductSearch[] = [];
  loading: boolean = false;
  list_gp: GenericProduct[] = [];
  from_pdtsearch: boolean = true;

  constructor(
    public bannerService: BannerService,
    private page: PageService,
    private titleService: Title,
    public subcategoryService: SubcategoryService,
    public productService: ProductService,
    public route: ActivatedRoute,
    public fb: FormBuilder,
  ){

    this.filterForm = this.fb.group({
      pageSize: environment.pageSize,
      pageNumber: 1,
      totalRecords: 1,
      subCategoryId: '',
      Title: '',
      District: '',
    });


  }

  ngOnInit(): void {
    
    console.log("In function ngOnInit");

    this.titleService.setTitle(this.pageTitle);

    this.bannerService
    .getBannerImages(Page.ProductListingPage)
    .pipe(takeUntil(this.ngUnsubscribe$))
    .subscribe({
      next: (res) => {
        this.banners = res.data;       
      },
      error: (err: any) => {
        this.page.handleError(err);       
      },
    });    
    
    
    this.subcategoryService
    .getSubCategoryTree()
    .pipe(takeUntil(this.ngUnsubscribe$))
    .subscribe({
      next: (res) => {
        this.categoryTree = res;      
      },
      error: (err: any) => {
        this.page.handleError(err);      
      },
    });

    this.initialize();



  }

  initialize123() {

    console.log("In function Initialize start ");
    this.route.queryParams.pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (params: any) => {
        console.log(params);
        this.filterForm.patchValue({
          subCategoryId: params.subCategoryId,          
          pageSize: 20,
          pageNumber: 1,
          totalRecords: 1,
          Title: params.Title,         
          District: params.District
          
        });
        this.breadcrumbs[2].title = params.Title;

        if(params.Title!="")
          {
            this.getSellerProducts(this.filterForm.value);
            this.getGenericProducts(this.filterForm.value);
            console.log("sellerproduct");   console.log(this.list_sp);
            console.log("Genericproduct");  console.log(this.list_gp);
            this.getCombinedProducts();
          }

      }
    });

  }

  initialize(): void {
    this.route.queryParams.pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (params: any) => {
        console.log(params);

        this.filterForm.patchValue({
          subCategoryId: params.subCategoryId,
          pageSize: 20,
          pageNumber: 1,
          totalRecords: 1,
          Title: params.Title,
          District: params.District
        });

        this.breadcrumbs[2].title = params.Title;

        if (params.Title !== "") {
          this.loading = true;

          // Perform async calls concurrently using forkJoin
          forkJoin({
            sellerProducts: this.getSellerProducts(this.filterForm.value),
            genericProducts: this.getGenericProducts(this.filterForm.value)
          }).subscribe({
            next: (results) => {
              // Now, use the results to combine them
              
              
              this.list_sp = results.sellerProducts.data;
              this.list_gp = results.genericProducts.data;

              // Combine the two lists into one
              this.getCombinedProducts();

              console.log("Seller Products:", this.list_sp);
              console.log("Generic Products:", this.list_gp);
              console.log("Combined Products:", this.list);

              // After the async calls, set loading to false
              this.loading = false;
            },
            error: (err) => {
              this.loading = false;
              this.page.handleError(err);
            }
          });
        } else {
          this.loading = false;
        }

        console.log("In function Initialize end");
      },
      error: (err) => {
        this.page.handleError(err);
      }
    });
  }


  getSellerProducts(query: any) {
    console.log("In function getsellerproduct");
   
    if (!query.subCategoryId) {
      delete query.subCategoryId;
    }
    if (!query.Title) {
      delete query.Title;
    }
    if (!query.District) {
      delete query.District;
    }
    console.log(query); 
    
    return this.productService
    .getAllSellerProducts(query)
    .pipe(
      takeUntil(this.ngUnsubscribe$)
    );

  
    

  }



  getGenericProducts(query: any){
    console.log("In function Getgenericproduct");

    this.loading = true;
    if (!query.subCategoryId) {
      delete query.subCategoryId;
    }
    if (!query.Title) {
      delete query.Title;
    }
    if (!query.District) {
      delete query.District;
    }  

    console.log(query);


    return this.productService
    .getGenericProducts(query)
    .pipe(
      takeUntil(this.ngUnsubscribe$)
    );



  }


  getCombinedProducts() {
    console.log("In getCombinedProducts");
    console.log("Seller Product In getCombinedProducts"); console.log(this.list_sp);
    console.log("Generic Product In getCombinedProducts"); console.log(this.list_gp);
    this.list=
     [
        ...this.list_sp.map(product => ({
            Id: product.sellerProductId,
            title: product.title,
            image: product.image,
            shortDescription:product.shortDescription,
            description:product.description,
            specifications:product.specifications,
            rating:product.rating,
            seoTitle:product.seoTitle,
            h1Tag:product.h1Tag,
            metaDescription:product.metaDescription,
            categoryId:product.categoryId,
            categoryName:product.categoryName,
            categoryImage:product.categoryImage,
            subCategoryId:product.subCategoryId,
            subCategoryName:product.subCategoryName,
            subCategoryImage:product.subCategoryImage,
            isDeleted:product.isDeleted ,
            sellerProductId: product.sellerProductId, 
            genericProductId:''
        })),
        ...this.list_gp.map(genericProduct => ({
            Id: genericProduct.genericProductId,
            title:genericProduct.title,
            image: genericProduct.image,
            shortDescription:genericProduct.shortDescription,
            description:genericProduct.description,
            specifications:genericProduct.specifications,
            rating:genericProduct.rating,
            seoTitle:genericProduct.seoTitle,
            h1Tag:genericProduct.h1Tag,
            metaDescription:genericProduct.metaDescription,
            categoryId:genericProduct.categoryId,
            categoryName:genericProduct.categoryName,
            categoryImage:genericProduct.categoryImage,
            subCategoryId:genericProduct.subCategoryId,
            subCategoryName:genericProduct.subCategoryName,
            subCategoryImage:genericProduct.subCategoryImage,
            isDeleted:genericProduct.isDeleted,
            sellerProductId:'',
            genericProductId:genericProduct.genericProductId
        }))
    ];
/*
    this.list = Array.from(new Map(this.list.map(product => 
      [`${product.title}_${product.categoryId}`, product]  // Combine title and categoryId as the key
  )).values());*/


    // Use a Map to combine products based on title and categoryId
    const combinedMap = new Map();

    this.list.forEach(product => {
        const key = `${product.title}_${product.categoryId}`;

        if (combinedMap.has(key)) {
            // If the product with the same title and categoryId already exists
            const existingProduct = combinedMap.get(key);

            // Merge sellerProductId and genericProductId (populate only if missing)
            existingProduct.sellerProductId = existingProduct.sellerProductId || product.sellerProductId;
            existingProduct.genericProductId = existingProduct.genericProductId || product.genericProductId;
        } else {
            // If no existing product, just add it to the map
            combinedMap.set(key, { ...product });
        }
    });

    // Convert the map back to an array
    this.list = Array.from(combinedMap.values());


    console.log("The combinedProducts is:", JSON.stringify(this.list, null, 2));
}


  showFilter() {
    this.filter = !this.filter;
  }

  onFilterChange() {
    this.filter = false;
  }


  getMoreProducts() {
    console.log("In function getMoreProducts start");
    if (
      this.totalPages.length > this.filterForm.value.pageNumber &&
      this.loading == false
    ) {
      let query = this.filterForm.value;
      query.pageNumber = query.pageNumber + 1;
      this.loading = true;
      if (!query.subCategoryId) {
        delete query.subCategoryId;
      }
       
       // Perform async calls concurrently using forkJoin
       forkJoin({
        sellerProducts: this.getSellerProducts(this.filterForm.value),
        genericProducts: this.getGenericProducts(this.filterForm.value)
      }).subscribe({
        next: (results) => {
          // Now, use the results to combine them
          
          
          this.list_sp = results.sellerProducts.data;
          this.list_gp = results.genericProducts.data;

          // Combine the two lists into one
          this.getCombinedProducts();

          console.log("Seller Products in combine method:", this.list_sp);
          console.log("Generic Products in combine method:", this.list_gp);
          console.log("Combined Products in combine method:", this.list);

          // After the async calls, set loading to false
          this.loading = false;
        },
        error: (err) => {
          this.loading = false;
          this.page.handleError(err);
        }
      });
   
      }
      console.log("In function getMoreProducts end");
  }

  get totalPages(): any {
    let n: any = Math.ceil(
      this.filterForm.value.totalRecords / this.filterForm.value.pageSize
    );
    const arr: any = Array.from({ length: n }, (_, i) => i);
    return arr;
  }
  
}
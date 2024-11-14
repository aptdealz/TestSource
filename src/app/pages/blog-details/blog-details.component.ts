import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { PageService } from 'src/app/services/page.service';
import { UserService } from 'src/app/services/user.service';
import { BlogService } from 'src/app/services/blog.service';
import { LoginComponent } from 'src/app/shared/modals/login/login.component';
import { BreadcrumbItem } from 'src/app/models/generic/breadcrumb-item';
import { Blog, BlogComment } from 'src/app/models/blog.model';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
@Component({
  selector: 'app-blog-details',
  templateUrl: './blog-details.component.html',
  styleUrls: ['./blog-details.component.scss'],
})
export class BlogDetailsComponent implements OnInit, OnDestroy {
  private ngUnsubscribe$ = new Subject<void>();
  breadcrumbs: BreadcrumbItem[] = [
    { title: 'Home', path: '/' },
    { title: 'Blog', path: '/blog' },
    { title: 'Article Title', path: '' },
  ];
  comments: BlogComment[] = [];
  pageTitle: string = 'Blog Details';
  id: any;
  data!: Blog;
  blogGroup!: FormGroup;
  constructor(
    private titleService: Title,
    public blogService: BlogService,
    public route: ActivatedRoute,
    private fb: FormBuilder,
    public authService: AuthService,
    public page: PageService,
    public userService: UserService,
    public dialog:MatDialog
  ) {}

  ngOnInit(): void {
    this.blogGroup = this.fb.group({
      comments: ['',Validators.required],
      blogId: [''],
      userId: [''],
    });

    this.titleService.setTitle(this.pageTitle);
    this.route.params.pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (params: any) => {
        this.id = params['id'];

        this.getBlogEntryById();
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
  getBlogEntryById() {
    this.blogService
      .getBlogEntryById(this.id)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res) => {
          this.data = res.data;
          this.breadcrumbs = [
            { title: 'Home', path: '/' },
            { title: 'Blog', path: '/blog' },
            { title: this.data.title, path: '' },
          ];
        },
        error: (err: any) => {
          this.page.handleError(err);
        },
      });
    this.getComments();
  }

  getComments() {
    this.blogService.getComments({ BlogId: this.id }).subscribe({
      next: (res) => {
        this.comments = res.data;
      },
      error: (err: any) => {
        this.page.handleError(err);
      },
    });
  }
  submit() {
    this.blogGroup.markAllAsTouched();
    if (this.authService.isLoggedIn) {
      let userid = this.userService.getUserId();
      this.blogGroup.patchValue({
        userId: userid,
        blogId: this.id,
      });
      if(this.blogGroup.valid){
      this.blogService
        .postComment(this.blogGroup.value)
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe({
          next: (_) => {
            this.getComments();
            this.page.showSuccessToast('Comment added');
            this.blogGroup.reset();
          },
          error: (err: any) => {
            this.page.showErrorToast('Some error occoured');
            this.page.handleError(err);
          },
        });
      }
    } else {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.panelClass = 'login-dialog';
      dialogConfig.disableClose =true;
      const dialogRef = this.dialog.open(LoginComponent, {
        ...dialogConfig
      });
    }
  }
  get f() {
    return this.blogGroup.controls;
  }
}

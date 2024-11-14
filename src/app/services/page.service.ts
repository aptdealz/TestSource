import { HostListener, Inject, Injectable, PLATFORM_ID, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  LoadingStatus,
  NewLoadingStatus,
} from '../models/generic/loading-status.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from '../material-components/snackbar/snackbar.component';
import { SnackbarData } from '../models/material-components/snackbar-data.model';
import { SpinnerService } from './spinner.service';
import { isPlatformBrowser } from '@angular/common';
@Injectable({
  providedIn: 'root',
})
export class PageService {
  private meta = inject(Meta);
  private title = inject(Title);
  public snackBar = inject(MatSnackBar);
  public spinner = inject(SpinnerService);
  private company = environment.companyName;
  sidebar = true;
  loader = true;
  myProfileUpdate = new Subject<any>();
  screenSize: any;
  platformid:any
  constructor(@Inject(PLATFORM_ID) platformid:any){
    this.platformid=platformid
  }

  private loadingStatus$ = new BehaviorSubject<LoadingStatus>(
    new NewLoadingStatus()
  );

  getLoadingStatus(): Observable<LoadingStatus> {
    return this.loadingStatus$.asObservable();
  }

  toggleLoadingStatus(status: LoadingStatus): void {
    this.loadingStatus$.next(status);
  }

  showLoader = (
    showSpinner = true,
    message = 'Loading...',
    height = 300
  ): boolean => {
    if (showSpinner) {
      this.spinner.show();
    }
    this.toggleLoadingStatus({ loading: true, message, height });
    return true;
  };
  hideLoader = (message = '', height = 0): boolean => {
    this.spinner.hide();
    this.toggleLoadingStatus({ loading: false, message, height });
    return false;
  };

  setTitle = (title: string) =>
    this.title.setTitle(`${title} | ${this.company}`);

  updateMeta = (name: string, content: string) =>
    this.meta.updateTag({ name, content });
  updateMetaDescription = (description: string) =>
    this.updateMeta('description', description);

  setTitleAndDescription = (title: string, description: string) => {
    this.setTitle(title);
    this.updateMetaDescription(description);
  };
  #showToast(
    type: 'error' | 'info' | 'success' | 'warning',
    message: string,
    title = ''
  ) {
    let snackbarData: SnackbarData = {
      action: title,
      message: message,
      panelClass: [],
    };

    let panelClass = ['snackbar'];
    switch (type) {
      case 'error':
        panelClass.push('error-snackbar');
        break;
      case 'info':
        panelClass.push('info-snackbar');
        break;
      case 'success':
        panelClass.push('success-snackbar');
        break;
      case 'warning':
        panelClass.push('warning-snackbar');
        break;
      default:
        break;
    }
    this.snackBar.openFromComponent(SnackbarComponent, {
      panelClass,
      data: snackbarData,
      duration: 2500,
      verticalPosition: 'top',
      horizontalPosition: 'end',
    });
  }
  showErrorToast(message: string, title = 'Error') {
    this.#showToast('error', message, title);
  }
  showInfoToast(message: string, title = 'Info') {
    this.#showToast('info', message, title);
  }
  showSuccessToast(message: string, title = 'Success') {
    this.#showToast('success', message, title);
  }
  showWarningToast(message: string, title = 'Warning') {
    this.#showToast('warning', message, title);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    const screenWidth = event.target.innerWidth;
    if (screenWidth < 576) {
      this.screenSize = 'sm';
    } else if (screenWidth < 992) {
      this.screenSize = 'lg';
    } else {
      this.screenSize = 'xl';
    }
  }

  handleError(errObject: any): boolean {
    if (environment.dev) {
      const errorMessage =
        errObject && errObject.error && errObject.error.message
          ? errObject.error.message
          : 'Server Error Occured';
      this.showErrorToast(errorMessage);
      console.error(errObject);
    }
    this.spinner.hide();
    return false;
  }

  /*  public showImageInModal(
    imageUrl: string,
    dialogSize: 'sm' | 'md' | 'lg' = 'md',
    timeout = 0
  ): Promise<boolean> {
    let modalOptions = {};
    if (dialogSize === 'sm' || dialogSize === 'lg') {
      modalOptions = { size: dialogSize, backdrop: 'static', keyboard: false };
    } else {
      modalOptions = {
        windowClass: 'md-class',
        backdrop: 'static',
        keyboard: false,
      };
    }
    const modalRef = this.modalService.open(
      ImageViewerDialogComponent,
      modalOptions
    );
    modalRef.componentInstance.imageUrl = imageUrl;
    if (timeout) {
      window.setTimeout(() => modalRef.dismiss(), timeout);
    }
    return modalRef.result;
  } */

  isPlatformBrowser(){
    return isPlatformBrowser(this.platformid)
  }
}

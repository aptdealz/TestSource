import { Component, Inject, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
declare const gtag: Function;
import { filter, map } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  private router = inject(Router);
  ngOnInit() {
    // window.scrollTo(0, 0);
    this.createGoogleTagForPageView();
  }

  createGoogleTagForPageView = () => {
    let gaTrackId = environment.MEASUREMENTID;
    if (gaTrackId) {
      this.router.events.pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        map((e) => {
          gtag('event', 'page_view', { page_path: e.urlAfterRedirects });
        })
      );
    }
  };

  grabTheTrackId() {
    let gaTrackId = environment.MEASUREMENTID;
    if (gaTrackId) {
      let customGtagScriptEle: HTMLScriptElement =
        document.createElement('script');
      customGtagScriptEle.async = true;
      customGtagScriptEle.src =
        'https://www.googletagmanager.com/gtag/js?id=' + gaTrackId;
      document.head.prepend(customGtagScriptEle);
      gtag('config', environment.MEASUREMENTID, { send_page_view: false });
    }
  }
}

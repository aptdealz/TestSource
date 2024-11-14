import { Inject, Injectable, PLATFORM_ID, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { PageService } from './page.service';

@Injectable({
  providedIn: 'root',
})
export class QrCodeService {
  basePath = environment.baseApiUrl;
  private page = inject(PageService);
  private http = inject(HttpClient);

  scanQRandUpdateOrder(data: any) {
    return this.http.put(
      `${this.basePath}/v1/Order/ScanQRCodeAndUpdateOrder`,
      data
    );
  }

  getGenerateQRCodeImageById = async (id: any): Promise<string> => {
    let useStorageData
    if(this.page.isPlatformBrowser()){
      useStorageData = localStorage.getItem('userData');
    }
    const user = useStorageData
      ? JSON.parse(useStorageData)
      : { jwToken: 'unauthorized' };
    const fetchUrl = `${this.basePath}/v1/Order/GenerateQRCodeImageForBuyerApp/${id}`;
    const headers = { Authorization: `Bearer ${user.jwToken}` };
    const response = await fetch(fetchUrl, { headers });
    const blobResponse = await response.blob();
    const urlCreator = window.URL || window.webkitURL;
    const imageUrl = urlCreator.createObjectURL(blobResponse);
    return imageUrl;
  };
}

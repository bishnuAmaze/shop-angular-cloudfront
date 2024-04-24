import { Injectable } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { ApiService } from '../../core/api.service';
import { map, switchMap } from 'rxjs/operators';
import { HttpHeaders } from '@angular/common/http';

@Injectable()
export class ManageProductsService extends ApiService {
  uploadProductsCSV(file: File): Observable<unknown> {
    if (!this.endpointEnabled('import')) {
      console.warn(
        'Endpoint "import" is disabled. To enable change your environment.ts config',
      );
      return EMPTY;
    }

    return this.getPreSignedUrl(file.name).pipe(
      map((url: { url: string }) => url.url),
      switchMap((url) =>
        this.http.put(url, file, {
          headers: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            'Access-Control-Allow-Origin': '*',
          },
        }),
      ),
    );
  }

  private getPreSignedUrl(fileName: string): Observable<{ url: string }> {
    const url = this.getUrl('import', 'import');

    localStorage.setItem(
      'authorization_token',
      'YmlzaG51QW1hemU9VEVTVF9QQVNTV09SRA==',
    );
    const authorization_token = localStorage.getItem('authorization_token');

    const headers = new HttpHeaders().set(
      'Authorization',
      'Basic ' + authorization_token,
    );

    return this.http.get<{ url: string }>(url, {
      headers: headers,
      params: {
        name: fileName,
      },
    });
  }
}

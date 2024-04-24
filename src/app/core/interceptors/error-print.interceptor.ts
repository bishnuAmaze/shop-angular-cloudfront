import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { NotificationService } from '../notification.service';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class ErrorPrintInterceptor implements HttpInterceptor {
  constructor(private readonly notificationService: NotificationService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((err: any) => {
        let errorMessage;

        if (err.status === 401) {
          errorMessage = `Authentication failed. Please check your credentials.`;
        } else if (err.status === 403) {
          errorMessage = `Authorization failed. You do not have the necessary permissions.`;
        } else {
          const url = new URL(request.url);
          errorMessage = `Request to "${url.pathname}" failed. Check the console for the details`;
        }

        this.notificationService.showError(errorMessage, 0);

        return throwError(err);
      }),
    );
  }
}

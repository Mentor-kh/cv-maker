/*eslint:disable:no-any*/
import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { SessionService } from '../services/session.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  public constructor(private sessionService: SessionService) { }

  /**
    * @desc The JWT Interceptor intercepts http requests from the application to add a JWT auth token
    *       to the Authorization header if the user is logged in. It's implemented using the
    *       HttpInterceptor class, so by extending this class we can create a custom interceptor to
    *       modify http requests before they get sent to the server.
   * @param {HttpRequest<any>} request The outgoing request to handle.
   * @param {HttpHandler} next The next interceptor in the chain, or the backend if no interceptors in
   *                           the chain.
   */
  public intercept(
    request: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    if (this.sessionService.isSessionActive()) {
      request = this.addTokenToHeaders(request);
    }
    return next.handle(request);
  }

  /**
   * @description Additionally adds token from session service to headers.
   * @param {HttpRequest<any>} request The outgoing request to handle.
   */
  private addTokenToHeaders(request: HttpRequest<any>): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${ this.sessionService.session.entityId }`,
      },
    });
  }
}
/*eslint:enable:no-any*/

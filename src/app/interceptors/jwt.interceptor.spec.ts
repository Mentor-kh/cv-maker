import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';

import { JwtInterceptor } from './jwt.interceptor';

describe('JwtInterceptor', () => {
  let http: HttpClient;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        HttpClient,
        JwtInterceptor,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: JwtInterceptor,
          multi: true,
        },
      ],
    });


    http = TestBed.inject(HttpClient);
    httpTesting = TestBed.inject(HttpTestingController);
    localStorage.removeItem('id');
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should be created', () => {
    const interceptor: JwtInterceptor = TestBed.inject(JwtInterceptor);
    expect(interceptor).toBeTruthy();
  });

  it('should append the user token to the Authorization header with a Bearer prefix', () => {
    let userToken = localStorage.getItem('id');
    expect(userToken).toBeNull();

    localStorage.setItem('entityId', 'fakeTokenValue');
    localStorage.setItem('expires', (Date.now() + 9999).toString());
    userToken = localStorage.getItem('entityId');
    expect(userToken).toBeTruthy();

    http.get('/test').subscribe(() => {
      // Required to trigger the httpTesting.expectOne
    });

    const req = httpTesting.expectOne('/test');
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.has('Authorization')).toBeTrue();
    expect(req.request.headers.get('Authorization')).toEqual(`Bearer ${userToken}`);
    req.flush('HTTP for testing purposes');
  });
});

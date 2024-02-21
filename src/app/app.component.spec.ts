import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { apiConfigFactory } from './app.module';
import { AuthModule } from './components/auth/auth.module';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HeaderComponent } from './components/header/header.component';
import { PublicModule } from './components/public/public.module';
import { ApiModule, Token } from './swagger-api';
import { SharedModule } from './common/shared.module';
import { Subject, Subscription, of, throwError } from 'rxjs';
import { AppRoutes } from './common/app.routes';
import { HttpErrorResponse } from '@angular/common/http';
import { subjectsComplete } from './common/helpers';

export const tokenMock: Token = {
  entityId: 'qwerqtqerq',
  expires: '123123123',
  userId: 'userIdmock'
}

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        BrowserModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
        ApiModule.forRoot(apiConfigFactory),
        AuthModule,
        PublicModule,
        HeaderComponent,
        DashboardComponent,
        SharedModule,
      ],
      declarations: [AppComponent]
    });

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  describe('#logout', () => {
    it('Success logout', () => {
      const removeSessionSpy: jasmine.Spy = spyOn(component['sessionService'], 'removeSession').and.stub();
      const routerSpy: jasmine.Spy = spyOn(component['router'], 'navigateByUrl').and.stub();
      spyOn(component['authService'], 'logout').and.returnValue(of({}));
      component.logout();
      expect(removeSessionSpy).toHaveBeenCalled();
      expect(routerSpy).toHaveBeenCalled();
      expect(routerSpy).toHaveBeenCalledWith(AppRoutes.baseUrl);
    });
    it('Error logout', () => {
      const removeSessionSpy: jasmine.Spy = spyOn(component['sessionService'], 'removeSession').and.stub();
      const routerSpy: jasmine.Spy = spyOn(component['router'], 'navigateByUrl').and.stub();
      spyOn(component['authService'], 'logout').and.returnValue(throwError(() => new HttpErrorResponse({error: 'mock error'})));
      component.logout();
      expect(removeSessionSpy).toHaveBeenCalled();
      expect(routerSpy).toHaveBeenCalled();
      expect(routerSpy).toHaveBeenCalledWith(AppRoutes.baseUrl);
    });
  });

  describe('#checkisAuthentificated', () => {
    it('Should check token success response', () => {
      const routerSpy: jasmine.Spy = spyOn(component['router'], 'navigateByUrl').and.stub();
      spyOn(component['authService']['apiService'], 'restAuthLoginPut').and.returnValue(of(tokenMock));
      const removeSessionSpy: jasmine.Spy = spyOn(component['authService'], 'prolong').and.callThrough();
      component['sessionService'].sessionChanges.subscribe(() => {
        expect(removeSessionSpy).toHaveBeenCalled();
        expect(component.isAuthentificated).toBeTruthy(); 
        expect(routerSpy).not.toHaveBeenCalled();   
      });
      component['sessionService']['sessionChanges$'].next(tokenMock);
    });
    it('Should check token error response', () => {
      const routerSpy: jasmine.Spy = spyOn(component['router'], 'navigateByUrl').and.stub();
      const removeSessionSpy: jasmine.Spy = spyOn(component['authService'], 'prolong').and.returnValue(throwError(() => new HttpErrorResponse({error: 'mock error'})));
      component['sessionService'].sessionChanges.subscribe(() => {
        expect(removeSessionSpy).toHaveBeenCalled();
        expect(component.isAuthentificated).toBeFalsy(); 
        expect(routerSpy).toHaveBeenCalled();
        expect(routerSpy).toHaveBeenCalledWith(AppRoutes.baseUrl);
      });
      component['sessionService']['sessionChanges$'].next(tokenMock);
    });
  });

  it('#subjectsComplete helpers', () => {
    const subj: Subject<any> = new Subject();
    const spy: jasmine.Spy = spyOn(subj, 'complete').and.stub();

    component['subjects$'].push(subj);
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
  });
});

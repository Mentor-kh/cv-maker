import { waitForAsync, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { DashboardComponent } from './dashboard.component';
import { DefaultService, UserBasic } from 'src/app/swagger-api';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { mockUserBasic } from '../public/user-profile/mock-users';
import { HttpErrorResponse, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [DashboardComponent],
    providers: [DefaultService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
}).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
  
  describe('#getUsers', () => {
    it('Should check success receive data', () => {
      spyOnProperty<any>(component['dataService'], 'users', 'get').and.returnValue(of([mockUserBasic]));
      component['getUsers']();
      expect(component.users).toEqual([mockUserBasic]);
      expect(component.isDataLoaded).toBeTruthy();
    });
    it('Should check error receive data', () => {
      spyOnProperty<any>(component['dataService'], 'users', 'get').and.returnValue(throwError(() => new HttpErrorResponse({error: 'mock error'})));
      component['getUsers']();
      expect(component.error).toEqual('mock error');
    });
  });
});

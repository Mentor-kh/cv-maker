import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { RouterTestingModule } from '@angular/router/testing';
import { DefaultService } from 'src/app/swagger-api';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { tokenMock } from 'src/app/app.component.spec';
import { of, throwError } from 'rxjs';
import { getElemById } from 'src/app/common/test.helpers.spec';
import { HttpErrorResponse } from '@angular/common/http';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [RouterTestingModule, HttpClientTestingModule, BrowserAnimationsModule, MatDialogModule],
    providers: [DefaultService],
});
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#proceedSubmitAction', () => {
    it('Should check form success submit action', () => {
      component.form.patchValue({phone: '1234567890', password: 'sdfdf'});
      const proceedFormSubmitSpy: jasmine.Spy = spyOn(component, 'proceedFormSubmit').and.callThrough();
      spyOn(component['authService']['apiService'], 'restAuthLoginPost').and.returnValue(of(tokenMock));
      const loginSpy: jasmine.Spy = spyOn(component['authService'], 'login').and.callThrough();
      getElemById(fixture, 'button-login').click();
      expect(proceedFormSubmitSpy).toHaveBeenCalled();
      expect(loginSpy).toHaveBeenCalled();
      expect(component.formError).toBe('');
    });
    it('Should check form error submit action', () => {
      component.form.patchValue({phone: '1234567890', password: 'sdfdf'});
      const proceedFormSubmitSpy: jasmine.Spy = spyOn(component, 'proceedFormSubmit').and.callThrough();
      const loginSpy: jasmine.Spy = spyOn(component['authService'], 'login').and.returnValue(throwError(() => new HttpErrorResponse({error: 'mock error'})));
      getElemById(fixture, 'button-login').click();
      expect(proceedFormSubmitSpy).toHaveBeenCalled();
      expect(loginSpy).toHaveBeenCalled();
      expect(component.formError).toBe('mock error');
    });
  });
});

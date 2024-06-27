import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupComponent } from './signup.component';
import { RouterTestingModule } from '@angular/router/testing';
import { DefaultService } from 'src/app/swagger-api';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { MatCheckboxHarness } from '@angular/material/checkbox/testing';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { HttpErrorResponse, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { tokenMock } from 'src/app/app.component.spec';
import { getElemById } from 'src/app/common/test.helpers.spec';
import { mockProfile } from '../profile/profile.mock';

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [RouterTestingModule,
        BrowserAnimationsModule,
        MatDialogModule],
    providers: [
        DefaultService,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
    ]
});
    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#proceedSubmitAction', () => {
    it('Should check form success submit action', () => {
      component.form.patchValue({...mockProfile, password: 'mock', tosAgreement: true});
      const proceedFormSubmitSpy: jasmine.Spy = spyOn(component, 'proceedFormSubmit').and.callThrough();
      spyOn(component['authService']['apiService'], 'restAuthSignupPost').and.returnValue(of({}));
      const createUserSpy: jasmine.Spy = spyOn(component['authService'], 'createUser').and.callThrough();
      getElemById(fixture, 'button-signup').click();
      expect(proceedFormSubmitSpy).toHaveBeenCalled();
      expect(createUserSpy).toHaveBeenCalled();
      expect(component.formError).toBe('');
    });
    it('Should check form error submit action', () => {
      component.form.patchValue({...mockProfile, password: 'mock', tosAgreement: true});
      const proceedFormSubmitSpy: jasmine.Spy = spyOn(component, 'proceedFormSubmit').and.callThrough();
      const createUserSpy: jasmine.Spy = spyOn(component['authService'], 'createUser').and.returnValue(throwError(() => new HttpErrorResponse({error: 'mock error'})));
      getElemById(fixture, 'button-signup').click();
      expect(proceedFormSubmitSpy).toHaveBeenCalled();
      expect(createUserSpy).toHaveBeenCalled();
      expect(component.formError).toBe('mock error');
    });
  });
});

import { ComponentFixture, DeferBlockState, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { ProfileComponent } from './profile.component';
import { RouterTestingModule } from '@angular/router/testing';
import { DefaultService } from 'src/app/swagger-api';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { EventEmitter } from '@angular/core';
import { getElemById } from 'src/app/common/test.helpers.spec';
import { Observable, of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { mockProfile } from './profile.mock';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [RouterTestingModule, HttpClientTestingModule, BrowserAnimationsModule, MatDialogModule],
    providers: [DefaultService]
});
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#DOM actions', () => {
    beforeEach(async () => {
      const deferBlockFixture = (await fixture.getDeferBlocks())[0];
      await deferBlockFixture.render(DeferBlockState.Complete);
    });
    it('Should check click on delete account button call necessary method', async () => {
      const deleteAccountSpy: jasmine.Spy = spyOn(component, 'deleteAccount').and.callThrough();
      getElemById(fixture, 'button-delete-account').click();
      expect(deleteAccountSpy).toHaveBeenCalled();
    });
    it('Should check click on add additional button call necessary method', async () => {
      const addAdditionalSpy: jasmine.Spy = spyOn(component, 'addAdditional').and.stub();
      getElemById(fixture, 'add-additional').click();
      expect(addAdditionalSpy).toHaveBeenCalled();
    });
    it('Should check click on delete additional button call necessary method', async () => {
      const deleteAdditionalSpy: jasmine.Spy = spyOn(component, 'deleteAdditional').and.stub();
      getElemById(fixture, 'add-additional').click();
      fixture.detectChanges();
      getElemById(fixture, 'delete-additional').click();
      expect(deleteAdditionalSpy).toHaveBeenCalled();
    });
    it('Should check form success submit action', () => {
      const proceedFormSubmitSpy: jasmine.Spy = spyOn(component, 'proceedFormSubmit').and.callThrough();
      spyOn(component['authService']['apiService'], 'restProfileUpdate').and.returnValue(of({}));
      const updateUserSpy: jasmine.Spy = spyOn(component['authService'], 'updateUser').and.callThrough();
      component['userData'] = mockProfile;
      component.form.patchValue(mockProfile);
      getElemById(fixture, 'button-update').click();
      expect(proceedFormSubmitSpy).toHaveBeenCalled();
      expect(updateUserSpy).toHaveBeenCalled();
      expect(component.formError).toBe('');
    });
    it('Should check form error submit action', () => {
      const proceedFormSubmitSpy: jasmine.Spy = spyOn(component, 'proceedFormSubmit').and.callThrough();
      const updateUserSpy: jasmine.Spy = spyOn(component['authService'], 'updateUser').and.returnValue(throwError(() => new HttpErrorResponse({error: 'mock error'})));
      component['userData'] = mockProfile;
      component.form.patchValue(mockProfile);
      getElemById(fixture, 'button-update').click();
      expect(proceedFormSubmitSpy).toHaveBeenCalled();
      expect(updateUserSpy).toHaveBeenCalled();
      expect(component.formError).toBe('mock error');
    });
    it('Should check location back action', () => {
      const locationBackSpy: jasmine.Spy = spyOn(component['location'], 'back').and.stub();
      getElemById(fixture, 'button-back').click();
      expect(locationBackSpy).toHaveBeenCalled();
    });
  });

  describe('#additionals', () => {
    it('Should return empty array by default', () => {
      expect(component.additionals.controls.length).toBe(0);
    });
    it('Should add additional fields correctly', () => {
      component.addAdditional();
      expect(component.additionals.controls.length).toBe(1);
      component.addAdditional();
      expect(component.additionals.controls.length).toBe(2);
    });
    it('Should delete additional fields correctly', () => {
      component.addAdditional();
      expect(component.additionals.controls.length).toBe(1);
      component.deleteAdditional(0);
      expect(component.additionals.controls.length).toBe(0);
    });
    it('Should move additional fields correctly', () => {
      const mockAdditionalValue: {} = { title: '', info: '' };
      const mockAdditionalPatchedValue: {} = { title: 'test', info: 'mock' };
      const mockDragDropEvent: CdkDragDrop<string[]> = {
        previousIndex: 0,
        currentIndex: 1,
      } as CdkDragDrop<string[]>;
      const mockDragDropEventInverted: CdkDragDrop<string[]> = {
        previousIndex: 1,
        currentIndex: 0,
      } as CdkDragDrop<string[]>;
      component.addAdditional();
      component.addAdditional();
      component.additionals.controls[0].patchValue(mockAdditionalPatchedValue);
      expect(component.additionals.controls[0].value).toEqual(mockAdditionalPatchedValue);
      expect(component.additionals.controls[1].value).toEqual(mockAdditionalValue);
      component.moveAdditional(mockDragDropEvent);
      expect(component.additionals.controls[1].value).toEqual(mockAdditionalPatchedValue);
      expect(component.additionals.controls[0].value).toEqual(mockAdditionalValue);
      component.moveAdditional(mockDragDropEventInverted);
      expect(component.additionals.controls[0].value).toEqual(mockAdditionalPatchedValue);
      expect(component.additionals.controls[1].value).toEqual(mockAdditionalValue);
    });
  });

  describe('#deleteAccount', () => {
    describe('check delete with close dialog without actions', () => {
      it('Should check dialog close button click', () => {
        const openSpy = spyOn(component['dialog'], 'open')
          .and
          .returnValue({
              afterClosed: () => of(false)
          } as MatDialogRef<typeof component>);
        spyOn(component['authService']['apiService'], 'restProfileDelete').and.returnValue(of({}));
        const deleteAccountSpy: jasmine.Spy = spyOn(component['authService'], 'deleteAccount').and.callThrough();
        component.deleteAccount();
        expect(openSpy).toHaveBeenCalled();
        expect(deleteAccountSpy).not.toHaveBeenCalled();
      });
    });

    describe('check delete with ok dialog with future actions', () => {
      let openSpy: jasmine.Spy;
      beforeEach(() => {
        openSpy = spyOn(component['dialog'], 'open')
          .and
          .returnValue({
              afterClosed: () => of(true)
          } as MatDialogRef<typeof component>);
      });
      it('Should check dialog ok button click', () => {
        const logoutSpy: jasmine.Spy = spyOn(component['authService'], 'logout').and.returnValue(of({}));
        const removeSessionSpy: jasmine.Spy = spyOn(component['sessionService'], 'removeSession').and.callThrough();
        spyOn(component['authService']['apiService'], 'restProfileDelete').and.returnValue(of({}));
        const deleteAccountSpy: jasmine.Spy = spyOn(component['authService'], 'deleteAccount').and.callThrough();
        component.deleteAccount();
        expect(openSpy).toHaveBeenCalled();
        expect(deleteAccountSpy).toHaveBeenCalled();
        expect(logoutSpy).toHaveBeenCalled();
        expect(removeSessionSpy).toHaveBeenCalled();
      });
  
      it('Should check dialog ok button click and delete account error', () => {
        const deleteAccountSpy: jasmine.Spy = spyOn(component['authService'], 'deleteAccount').and.returnValue(throwError(() => new HttpErrorResponse({error: 'mock error'})));
        component.deleteAccount();
        expect(openSpy).toHaveBeenCalled();
        expect(deleteAccountSpy).toHaveBeenCalled();
      });
      it('Should check dialog ok button click and logout error', () => {
          const logoutSpy: jasmine.Spy = spyOn(component['authService'], 'logout').and.returnValue(throwError(() => new HttpErrorResponse({error: 'mock error'})));
          const removeSessionSpy: jasmine.Spy = spyOn(component['sessionService'], 'removeSession').and.callThrough();
          const deleteAccountSpy: jasmine.Spy = spyOn(component['authService'], 'deleteAccount').and.returnValue(of({}));
          component.deleteAccount();
          expect(openSpy).toHaveBeenCalled();
          expect(deleteAccountSpy).toHaveBeenCalled();
          expect(logoutSpy).toHaveBeenCalled();
          expect(removeSessionSpy).not.toHaveBeenCalled();
      });
    });

    describe('#getUserData', () => {
      it('Should check success getting user data', () => {
        const getUserSpy: jasmine.Spy = spyOn(component['dataService'], 'getUser').and.returnValue(of(mockProfile));
        
        component['getUserData']();
        expect(getUserSpy).toHaveBeenCalled();
        expect(component.isDataLoaded).toBeTruthy();
        expect(component['userData']).toEqual(mockProfile);
      });
      it('Should check error getting user data', () => {
        const getUserSpy: jasmine.Spy = spyOn(component['dataService'], 'getUser').and.returnValue(throwError(() => new HttpErrorResponse({error: 'mock error'})));
        
        component['getUserData']();
        expect(getUserSpy).toHaveBeenCalled();
        expect(component['userData']).toBeUndefined();
        expect(component.formError).toEqual('mock error');
      });
      it('#restoreAdditionalData called', () => {
        const getUserSpy: jasmine.Spy = spyOn(component['dataService'], 'getUser').and.returnValue(of(mockProfile));
        const restoreAdditionalDataSpy: jasmine.Spy = spyOn(component, 'restoreAdditionalData').and.callThrough();
        
        component['getUserData']();
        expect(getUserSpy).toHaveBeenCalled();
        expect(restoreAdditionalDataSpy).toHaveBeenCalled();
      });
      it('#restoreAdditionalData not called', () => {
        const getUserSpy: jasmine.Spy = spyOn(component['dataService'], 'getUser').and.returnValue(of({...mockProfile, additionals: []}));
        const restoreAdditionalDataSpy: jasmine.Spy = spyOn(component, 'restoreAdditionalData').and.callThrough();
        
        component['getUserData']();
        expect(getUserSpy).toHaveBeenCalled();
        expect(restoreAdditionalDataSpy).not.toHaveBeenCalled();
      });
    });
  });
});

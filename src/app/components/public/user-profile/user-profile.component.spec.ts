import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserProfileComponent } from './user-profile.component';
import { RouterTestingModule } from '@angular/router/testing';
import { DefaultService } from 'src/app/swagger-api';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { mockUserBasic } from './mock-users';

describe('UserProfileComponent', () => {
  let component: UserProfileComponent;
  let fixture: ComponentFixture<UserProfileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [DefaultService],
    });
    fixture = TestBed.createComponent(UserProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('#getUsers', () => {
    it('Should check success receive data', () => {
      spyOn<any>(component['dataService'], 'getUser').and.returnValue(of(mockUserBasic));
      component['getUser'](mockUserBasic.id);
      expect(component.isDataLoaded).toBeTruthy();
      expect(component.userData).toEqual(mockUserBasic);
    });
    it('Should check error receive data', () => {
      spyOn<any>(component['dataService'], 'getUser').and.returnValue(throwError(() => new HttpErrorResponse({error: 'mock error'})));
      component['getUser'](mockUserBasic.id);
      expect(component.error).toEqual('mock error');
    });
  }); 
});

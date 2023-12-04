import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';

import { HeaderComponent } from './header.component';
import { RouterTestingModule } from '@angular/router/testing';
import { getElemById } from 'src/app/common/test.helpers.spec';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [
        NoopAnimationsModule,
        MatButtonModule,
        MatIconModule,
        MatListModule,
        MatSidenavModule,
        MatToolbarModule,
        HeaderComponent,
        RouterTestingModule,
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });

  [true, false].forEach((isAuthentificated: boolean) => {
    it(`#DOM elements existance check for ${isAuthentificated ? '' : 'not'} authentificated user`, () => {
      component.isAuthentificated = isAuthentificated;
      fixture.detectChanges();
      if (isAuthentificated) {
        expect(getElemById(fixture, 'button-login')).toBeNull();
        expect(getElemById(fixture, 'button-signup')).toBeNull();
        expect(getElemById(fixture, 'button-profile')).toBeDefined();
        expect(getElemById(fixture, 'button-logout')).toBeDefined();
      } else {
        expect(getElemById(fixture, 'button-login')).toBeDefined();
        expect(getElemById(fixture, 'button-signup')).toBeDefined();
        expect(getElemById(fixture, 'button-profile')).toBeNull();
        expect(getElemById(fixture, 'button-logout')).toBeNull();
      }
    });
  })

  it('#logout', () => {
    component.isAuthentificated = true;
    fixture.detectChanges();  
    const logoutSpy: jasmine.Spy = spyOn(component, 'logout').and.callThrough();
    const deleteSessionSpy: jasmine.Spy = spyOn(component['deleteSession'], 'emit').and.stub();
    getElemById(fixture, 'button-logout').click();
    expect(logoutSpy).toHaveBeenCalled();
    expect(deleteSessionSpy).toHaveBeenCalled();
  });
});

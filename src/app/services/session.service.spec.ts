import { TestBed } from '@angular/core/testing';

import { SessionService } from './session.service';

describe('SessionService', () => {
  let service: SessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#isSessionActive', () => {
    [
      [true, true], 
      [true, false], 
      [false, true], 
      [false, false],
    ].forEach(([isIdExists, isDateExpired]) => {
      it('Should check', () => {
        service['activeSession'].entityId = isIdExists ? 'mockId': '';
        service['activeSession'].expires = isDateExpired ? (Date.now() - 1).toString() : (Date.now() + 1).toString();
        expect(service.isSessionActive()).toBe(isIdExists && !isDateExpired);
      });
    });
  });
});

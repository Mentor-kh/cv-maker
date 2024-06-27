import { TestBed } from '@angular/core/testing';

import { ComponentsFactoryService } from './components-factory.service';

describe('ComponentsFactoryService', () => {
  let service: ComponentsFactoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComponentsFactoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

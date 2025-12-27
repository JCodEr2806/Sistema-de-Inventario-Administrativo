import { TestBed } from '@angular/core/testing';

import { CobrosPagosService } from './cobros-pagos.service';

describe('CobrosPagosService', () => {
  let service: CobrosPagosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CobrosPagosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

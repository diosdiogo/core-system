import { TestBed } from '@angular/core/testing';

import { RootDashboardService } from './root-dashboard.service';

describe('RootDashboardService', () => {
  let service: RootDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RootDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

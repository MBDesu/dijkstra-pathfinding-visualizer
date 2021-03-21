import { TestBed } from '@angular/core/testing';

import { WallDraggingService } from './wall-dragging.service';

describe('WallDraggingService', () => {
  let service: WallDraggingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WallDraggingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

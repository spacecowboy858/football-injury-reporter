import { TestBed } from '@angular/core/testing';

import { StudentCodeService } from './student-code.service';

describe('StudentCodeService', () => {
  let service: StudentCodeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudentCodeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

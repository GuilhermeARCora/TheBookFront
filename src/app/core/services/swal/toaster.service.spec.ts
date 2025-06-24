import { TestBed } from '@angular/core/testing';

import { ToasterService } from './toaster.service';

import Swal from 'sweetalert2';

describe('ToasterService', () => {
  let service: ToasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

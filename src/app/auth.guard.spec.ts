import {TestBed} from '@angular/core/testing';
import {AuthService} from "./services/auth.service";

describe('authGuard', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

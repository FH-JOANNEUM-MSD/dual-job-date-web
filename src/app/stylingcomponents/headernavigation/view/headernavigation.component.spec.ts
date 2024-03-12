import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadernavigationComponent } from './headernavigation.component';

describe('HeadernavigationComponent', () => {
  let component: HeadernavigationComponent;
  let fixture: ComponentFixture<HeadernavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeadernavigationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HeadernavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

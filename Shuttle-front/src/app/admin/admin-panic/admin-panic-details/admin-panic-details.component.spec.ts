import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPanicDetailsComponent } from './admin-panic-details.component';

describe('AdminPanicDetailsComponent', () => {
  let component: AdminPanicDetailsComponent;
  let fixture: ComponentFixture<AdminPanicDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminPanicDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminPanicDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

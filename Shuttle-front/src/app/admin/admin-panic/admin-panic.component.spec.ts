import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPanicComponent } from './admin-panic.component';

describe('AdminPanicComponent', () => {
  let component: AdminPanicComponent;
  let fixture: ComponentFixture<AdminPanicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminPanicComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminPanicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDriverProfileChangeComponent } from './admin-driver-profile-change.component';

describe('AdminDriverProfileChangeComponent', () => {
  let component: AdminDriverProfileChangeComponent;
  let fixture: ComponentFixture<AdminDriverProfileChangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminDriverProfileChangeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDriverProfileChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

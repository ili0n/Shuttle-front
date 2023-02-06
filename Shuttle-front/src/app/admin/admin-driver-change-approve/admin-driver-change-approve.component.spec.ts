import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDriverChangeApproveComponent } from './admin-driver-change-approve.component';

describe('AdminDriverChangeApproveComponent', () => {
  let component: AdminDriverChangeApproveComponent;
  let fixture: ComponentFixture<AdminDriverChangeApproveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminDriverChangeApproveComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDriverChangeApproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

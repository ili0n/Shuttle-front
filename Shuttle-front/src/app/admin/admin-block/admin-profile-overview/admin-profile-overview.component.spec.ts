import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminProfileOverviewComponent } from './admin-profile-overview.component';

describe('AdminProfileOverviewComponent', () => {
  let component: AdminProfileOverviewComponent;
  let fixture: ComponentFixture<AdminProfileOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminProfileOverviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminProfileOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

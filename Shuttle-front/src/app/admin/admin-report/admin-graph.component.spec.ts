import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminGraphComponent } from './admin-graph.component';

describe('AdminReportComponent', () => {
  let component: AdminGraphComponent;
  let fixture: ComponentFixture<AdminGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminGraphComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

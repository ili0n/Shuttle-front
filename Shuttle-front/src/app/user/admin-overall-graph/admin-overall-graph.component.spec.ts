import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminOverallGraphComponent } from './admin-overall-graph.component';

describe('AdminOverallGraphComponent', () => {
  let component: AdminOverallGraphComponent;
  let fixture: ComponentFixture<AdminOverallGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminOverallGraphComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminOverallGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

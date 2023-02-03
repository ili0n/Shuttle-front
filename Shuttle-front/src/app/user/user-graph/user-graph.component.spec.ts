import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserGraphComponent } from './user-graph.component';

describe('UserGraphComponent', () => {
  let component: UserGraphComponent;
  let fixture: ComponentFixture<UserGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserGraphComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

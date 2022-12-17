import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnregisteredPageComponent } from './unregistered-page.component';

describe('UnregisteredPageComponent', () => {
  let component: UnregisteredPageComponent;
  let fixture: ComponentFixture<UnregisteredPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnregisteredPageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnregisteredPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

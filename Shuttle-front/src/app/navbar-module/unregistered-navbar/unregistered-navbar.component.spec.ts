import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnregisteredNavbarComponent } from './unregistered-navbar.component';

describe('NavbarComponent', () => {
  let component: UnregisteredNavbarComponent;
  let fixture: ComponentFixture<UnregisteredNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnregisteredNavbarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnregisteredNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserModule } from 'src/app/user/user.module';

import { DriverGraphComponent } from './driver-graph.component';

describe('DriverGraphComponent', () => {
  let component: DriverGraphComponent;
  let fixture: ComponentFixture<DriverGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DriverGraphComponent ],
      imports: [
        HttpClientTestingModule,
        UserModule,
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DriverGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

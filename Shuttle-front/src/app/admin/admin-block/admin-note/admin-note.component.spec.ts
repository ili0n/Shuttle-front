import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminNoteComponent } from './admin-note.component';

describe('AdminNoteComponent', () => {
  let component: AdminNoteComponent;
  let fixture: ComponentFixture<AdminNoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminNoteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

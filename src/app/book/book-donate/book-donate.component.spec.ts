import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookDonateComponent } from './book-donate.component';

describe('BookDonateComponent', () => {
  let component: BookDonateComponent;
  let fixture: ComponentFixture<BookDonateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookDonateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BookDonateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BooksBorrowedComponent } from './books-borrowed.component';

describe('BooksBorrowedComponent', () => {
  let component: BooksBorrowedComponent;
  let fixture: ComponentFixture<BooksBorrowedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BooksBorrowedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BooksBorrowedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

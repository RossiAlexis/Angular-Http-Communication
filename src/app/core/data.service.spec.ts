import { HttpTestingController, HttpClientTestingModule, TestRequest } from '@angular/common/http/testing';
import { DataService } from './data.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Book } from 'app/models/book';
import { BookTrackerError } from 'app/models/bookTrackerError';

describe('DataService Test', () => {

  let dataService: DataService;
  let httpTEstingController: HttpTestingController;

  let testBooks: Book[] = [
    {
      bookID: 1,
      title: "Goodnight Moon",
      author: "Margaret Wise Brown",
      publicationYear: 1953
    },
    {
      bookID: 2,
      title: "Winnie-the-Pooh",
      author: "A. A. Milne",
      publicationYear: 1926
    },
    {
      bookID: 3,
      title: "Where the Wild Things Are",
      author: "Maurice Sendak",
      publicationYear: 1963
    },
  ]

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DataService],
      imports: [HttpClientTestingModule]
    });
    dataService = TestBed.get(DataService);
    httpTEstingController = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpTEstingController.verify();
  })

  it('should GET all books', () => {
    dataService.getAllBooks().subscribe((data: Book[]) => {
      expect(data.length).toBe(3);
    });

    let booksRequest: TestRequest = httpTEstingController.expectOne('/api/books');

    expect(booksRequest.request.method).toEqual('GET');

    booksRequest.flush(testBooks);
  });

  it('should return a BookTrackerError', () => {
    dataService.getAllBooks().subscribe((data: Book[]) => {
      fail('this should have benn an error')
    },
    (err: BookTrackerError) => {
      expect(err.errorNumber).toEqual(100);
      expect(err.friendlyMessage).toEqual('An error ocuyrred retrieving data')
    });

    let booksRequest: TestRequest = httpTEstingController.expectOne('/api/books');

    booksRequest.flush('error',{
      status: 500,
      statusText: 'serve error'
    });
  });


});


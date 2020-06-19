import { BookTrackerError } from 'app/models/bookTrackerError';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Title } from '@angular/platform-browser';

import { Book } from "app/models/book";
import { Reader } from "app/models/reader";
import { DataService } from 'app/core/data.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: []
})
export class DashboardComponent implements OnInit {

  allBooks: Book[];
  allReaders: Reader[];
  mostPopularBook: Book;

  constructor(private dataService: DataService,
    private title: Title,
    private router: ActivatedRoute) { }

  ngOnInit() {

    let resolvedData: Book[] | BookTrackerError = this.router.snapshot.data['resolvedBooks'];

    if (resolvedData instanceof BookTrackerError) {
      console.log(`Dashboard component error: ${resolvedData.friendlyMessage} `);
    } else {
      this.allBooks = resolvedData
    }

    this.dataService.getAllReaders().subscribe(
      (data: Reader[]) => this.allReaders = data
    );

    this.mostPopularBook = this.dataService.mostPopularBook;

    this.title.setTitle(`Book Tracker`);
  }

  deleteBook(bookID: number): void {
    this.dataService.deleteBook(bookID).subscribe(
      (data: void) => {
        const index = this.allBooks.findIndex(book => book.bookID === bookID);
        this.allBooks.splice(index, 1);
      },
      (err: any) => console.log(err)

    )
  }

  deleteReader(readerID: number): void {
    this.dataService.deleteReader(readerID).subscribe(
      (data: void) => {
        const index = this.allReaders.findIndex(reader => reader.readerID === readerID);
        this.allReaders.splice(index, 1);
      },
      (err: any) => console.log(err)

    )
  }

}

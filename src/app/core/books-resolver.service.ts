import { DataService } from 'app/core/data.service';
import { BookTrackerError } from './../models/bookTrackerError';
import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { Book } from "app/models/book";
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';


@Injectable({
  providedIn:'root'
})
export class BooksResolverService implements Resolve<Book[] | BookTrackerError> {

  constructor(private dataService: DataService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Book[] | BookTrackerError> {
    return this.dataService.getAllBooks().pipe(
      catchError(err => of(err))
    );
  }
}

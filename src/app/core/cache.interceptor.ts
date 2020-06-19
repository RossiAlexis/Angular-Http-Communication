import { HttpCacheService } from './../services/http-cache.service';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';


@Injectable()
export class CacheInterceptor implements HttpInterceptor {

  constructor(private cacheService: HttpCacheService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {


    //Invalidate cache with invalid request
    if (req.method !== 'GET') {
      this.cacheService.invalidateCache();
      return next.handle(req);
    }

    // Retirve values from the cache
    const cachedResponse: HttpResponse<any> = this.cacheService.get(req.url);
    if (cachedResponse) {
      return of(cachedResponse);
    }

    // send request to server and add response to cache
    return next.handle(req).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          this.cacheService.put(req.url, event)
        }
      })
    )
  }
}

import { Injectable } from '@angular/core';
import { Subscription, fromEvent, map, merge, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NetworkService {
  networkStatus: boolean = false;

  checkNetworkStatus() {
    this.networkStatus = navigator.onLine;
    return merge(
      of(null),
      fromEvent(window, 'online'),
      fromEvent(window, 'offline')
    ).pipe(map(() => navigator.onLine));
  }
}

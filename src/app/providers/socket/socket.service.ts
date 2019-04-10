import { Injectable } from '@angular/core';
import * as socketIo from 'socket.io-client';
import { environment } from '../../../environments/environment';
import { Observable, Observer, of, throwError } from 'rxjs';

const SERVER_URL = environment.wsUrl;

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  constructor() { }
  private socket;
  socketIsConnect = false;

  public initSocket(): void {
    this.socket = socketIo(SERVER_URL, { path: '/ws/socket.io' });
    this.socket.on('connect_error', (error) => {
      console.log('connection_error', error);
      this.socketIsConnect = false;
    });

    this.socket.on('connect', () => {
      console.log('connected ');
      this.socketIsConnect = true;
    });
  }

  public send(subject, message) {
    if (this.socketIsConnect) {
      this.socket.emit(subject, message);
    }
  }

  public onMessage(): Observable<any> {
    return new Observable<any>(observer => {
      this.socket.on('broadcast', (data) => {
        console.log(data);
        observer.next(data);

      });
    });
  }

  public onEvent(event): Observable<any> {
    return new Observable<any>(observer => {
      this.socket.on(event, () => observer.next());
    });
  }
}

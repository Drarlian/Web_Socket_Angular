import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket: WebSocket;
  private messages: Subject<any>;
  private clientId: string;

  constructor() {
    this.clientId = uuidv4();
    this.socket = new WebSocket('ws://localhost:8000/ws');
    this.messages = new Subject<any>();

    this.socket.onmessage = (event) => {
      this.messages.next(JSON.parse(event.data));
    };

    this.socket.onclose = (event) => {
      console.log(`Client disconnected with code: ${event.code}`);
    };
  }

  sendMessage(message: string): void {
    this.socket.send(JSON.stringify({ clientId: this.clientId, message }));
  }

  getMessages(): Observable<any> {
    return this.messages.asObservable();
  }

  getClientId(): string {
    return this.clientId;
  }

  close(){
    this.socket.close();
  }
}

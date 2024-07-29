import { Component, OnDestroy, OnInit } from '@angular/core';
import { WebSocketService } from '../../services/web-socket/web-socket.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy {
  message: string = '';
  messages: Array<{ clientId: string; message: string }> = [];
  private messageSubscription!: Subscription;

  constructor(private wsService: WebSocketService) {}

  ngOnInit(): void {
    this.messageSubscription = this.wsService.getMessages().subscribe((msg) => {
      this.messages.push(msg);
    });
  }

  sendMessage(event: Event): void {
    event.preventDefault();
    if (this.message.trim()) {
      this.wsService.sendMessage(this.message.trim());
      this.message = '';
    }
  }

  ngOnDestroy(): void {
    if (this.messageSubscription) {
      this.messageSubscription.unsubscribe();
      this.wsService.close();
    }
  }
}

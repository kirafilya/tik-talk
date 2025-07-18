import {ChatConnectionWSParams, ChatWSSerivce} from '../interfaces/chat-ws-service.interface';
import {WebSocketSubject} from 'rxjs/internal/observable/dom/WebSocketSubject';
import {ChatWSMessage} from '../interfaces/chat-ws-message.interface';
import {webSocket} from 'rxjs/webSocket';
import {finalize, Observable, tap} from 'rxjs';
import {inject} from '@angular/core';
import {AuthService} from '@tt/data-access';

export class ChatWsRxjsService implements ChatWSSerivce{
  #socket: WebSocketSubject<ChatWSMessage> | null = null;
  #authService = inject(AuthService);

  connect(params: ChatConnectionWSParams): Observable<ChatWSMessage> {

    if (!this.#socket) {
      this.#socket = webSocket({
        url: params.url,
        protocol: [params.token]
      });
    }

    return this.#socket.asObservable()
      .pipe(
        tap(message => params.handleMessage(message)),
        finalize(() => {
          this.#handleSocketClose(params)
        })
      )
  }

  disconnect(): void {
    this.#socket?.complete()
  }

  sendMessage(text: string, chatId: number): void {
    this.#socket?.next({
      text,
      chat_id: chatId
    })
  }

  #handleSocketClose(params: ChatConnectionWSParams): void {
    this.#authService.refreshAuthToken()

    if(this.#authService.token) {
      this.#socket?.complete()
      this.connect({
        url: params.url,
        token: this.#authService.token!,
        handleMessage: params.handleMessage
      })
    }
  }

}

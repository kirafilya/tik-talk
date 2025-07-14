import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {Chat, LastMessageRes, Message} from '../interfaces/chats';
import {Store} from '@ngrx/store';
import {AuthService, Profile, selectedMeProfile, TokenResponse} from '@tt/data-access';
import {ChatWSSerivce} from '../interfaces/chat-ws-service.interface';
import {ChatWSMessage} from '../interfaces/chat-ws-message.interface';
import {isChatWSError, isNewMessage, isUnreadMessage} from '../interfaces/type-guards';
import {ChatWsRxjsService} from './chat-ws-rxjs.service';

@Injectable({
  providedIn: 'root',
})
export class ChatsService {
  http = inject(HttpClient);
  store = inject(Store);
  #authService = inject(AuthService);

  me = this.store.selectSignal(selectedMeProfile);
  activeChatMessages = signal<Message[]>([]);

  countUnreadMessages = signal<number>(0);
  userConsumer = signal<Profile | null>(null);

  countUnreadMessagesOneUser = signal(new Map<number, number>());

  chatsUrl = 'https://icherniakov.ru/yt-course/chat/';
  wsAdapter: ChatWSSerivce = new ChatWsRxjsService();

  connectWS() {
    return this.wsAdapter.connect({
      url: `${this.chatsUrl}ws`,
      token: this.#authService.token ?? '',
      handleMessage: this.handleWSMessage
    }) as Observable<ChatWSMessage>;
  }

  handleWSMessage = (message: ChatWSMessage)=>  {
    if (!('action' in message)) return;

    if (isUnreadMessage(message)) {
      this.countUnreadMessages.set(message.data.count)
    }

    if (isChatWSError(message)) {
      this.#authService.refreshAuthToken().subscribe((token: TokenResponse) => {
        console.log('Токен обновлен', token.access_token);
      })
      this.wsAdapter.disconnect();
      this.connectWS().subscribe()
    }

    if (isNewMessage(message)) {

      if (!(message.data.author === this.me()?.id)) {
        const map = this.countUnreadMessagesOneUser();
        let chatsId = message.data.chat_id;

        if (!map.has(chatsId)) {
          map.set(chatsId, 1);
        } else {
          map.set(chatsId, map.get(chatsId)! + 1);
        }
        this.countUnreadMessagesOneUser.set(map);
      }


        this.activeChatMessages.set([
          ...this.activeChatMessages(),
          {
            id: message.data.id,
            userFromId: message.data.author,
            user: message.data.author === this.me()?.id ?
              this.me() : this.userConsumer(),
            personalChatId: message.data.chat_id,
            text: message.data.message,
            createdAt: message.data.created_at,
            isRead: false,
            isMine: message.data.author === this.me()?.id
          }
        ]);

    }
  }

  createChats(chatId: number) {
    return this.http.post<Chat>(`${this.chatsUrl}${chatId}`, {});
  }

  getMyChats() {
    return this.http.get<LastMessageRes[]>(`${this.chatsUrl}get_my_chats/`);
  }

  getChatById(chatId: number): Observable<Chat> {
    return this.http.get<Chat>(`${this.chatsUrl}${chatId}`).pipe(
      map((chat) => {

        const patchedMessages = chat.messages.map((message) => {

          this.userConsumer.set(chat.userFirst.id === this.me()!.id ?
            chat.userSecond : chat.userFirst);

          return {
            ...message,
            user:
              chat.userFirst.id === message.userFromId
                ? chat.userFirst
                : chat.userSecond,
            isMine: message.userFromId === this.me()!.id,
          };
        });

        this.activeChatMessages.set(patchedMessages);


        return {
          ...chat,
          companion:
            chat.userFirst.id === this.me()!.id
              ? chat.userSecond
              : chat.userFirst,
          messages: patchedMessages,
        };
      })
    );
  }

  deleteUnreadMessage(chatId: number) {
    const map = this.countUnreadMessagesOneUser();

    if (map.has(chatId)) {
      map.set(chatId, 0);
    }

    this.countUnreadMessagesOneUser.set(map);

  }

}

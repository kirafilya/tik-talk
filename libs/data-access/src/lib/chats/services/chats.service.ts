import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {Chat, LastMessageRes, Message} from '../interfaces/chats';
import {Store} from '@ngrx/store';
import {selectedMeProfile} from '@tt/profile';
import {AuthService, ProfileService, TokenResponse} from '@tt/data-access';
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
  #prolileService = inject(ProfileService);

  me = this.store.selectSignal(selectedMeProfile);
  activeChatMessages = signal<Message[]>([]);
  countUnreadMessages = signal<number>(0);

  chatsUrl = 'https://icherniakov.ru/yt-course/chat/';

  wsAdapter: ChatWSSerivce = new ChatWsRxjsService();
  // wsAdapter: ChatWSSerivce = new ChatWSNativeService();

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

    //   this.activeChatMessages.set([
    //     ...this.activeChatMessages(),
    //     {
    //       id: message.data.id,
    //       userFromId: message.data.author,
    //       personalChatId: message.data.chat_id,
    //       text: message.data.message,
    //       createdAt: message.data.created_at,
    //       isRead: false,
    //       isMine: message.data.author === this.me()?.id
    //
    //     }
    //   ])

    //вся эта хрень нужна, чтобы отрисовать аватарку, тк профаил не передается с ответом
    // веб сокета, и я ищу его по id
    this.#prolileService.getAccount(message.data.author.toString())
      .subscribe((user) => {
        this.activeChatMessages.set([
          ...this.activeChatMessages(),
          {
            id: message.data.id,
            userFromId: message.data.author,
            user,
            personalChatId: message.data.chat_id,
            text: message.data.message,
            createdAt: message.data.created_at,
            isRead: false,
            isMine: message.data.author === this.me()?.id
          }
        ]);
      });
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

  // sendMessage(chatId: number, message: string) {
  //   return this.http.post<Message>(
  //     `${this.messageUrl}send/${chatId}`,
  //     {},
  //     {
  //       params: {
  //         message,
  //       },
  //     }
  //   )
  // }
}

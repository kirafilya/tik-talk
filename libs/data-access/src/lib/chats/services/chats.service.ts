import {inject, Injectable, signal} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {Chat, LastMessageRes, Message} from '../interfaces/chats';
import {Store} from '@ngrx/store';
import {selectedMeProfile} from '@tt/profile';
import {AuthService} from '@tt/data-access';
import {ChatWSSerivce} from '../interfaces/chat-ws-service.interface';
import {ChatWSNativeService} from './chat-w-s-native.service';
import {ChatWSMessage} from '../interfaces/chat-ws-message.interface';
import {isNewMessage, isUnreadMessage} from '../interfaces/type-guards';

@Injectable({
  providedIn: 'root',
})
export class ChatsService {
  http = inject(HttpClient);
  store = inject(Store);
  #authService = inject(AuthService);

  me = this.store.selectSignal(selectedMeProfile);
  activeChatMessages = signal<Message[]>([]);

  chatsUrl = 'https://icherniakov.ru/yt-course/chat/';
  messageUrl = 'https://icherniakov.ru/yt-course/message/';
  baseApiUrl = 'https://icherniakov.ru/yt-course/';

  //создаем переменную, в которой будет лежать экземплояр нашего нового сервиса
  wsAdapter: ChatWSSerivce = new ChatWSNativeService()

  //создаем метод, где будем вызывать метод, который создает соединение,
  connectWS() {
    this.wsAdapter.connect({
      url: `${this.chatsUrl}ws`,
      token: this.#authService.token ?? '',
      //сюда передаем функцию, которая будет что-то делать, когда будет
      //выполняться какое-либо условие
      handleMessage: this.handleWSMessage
    })
  }

  //эта функция отрабатывает, когда появляется новое сообщение
  //она занимается отрисовкой нового сообщения
  //она стрелочная, чтобы activeChatMessages брался не из контекста вызова
  //а из контекста создания
  handleWSMessage = (message: ChatWSMessage)=>  {
    if (!('action' in message)) return;

    if (isUnreadMessage(message)) {
      //тут проверка чо сообщение непрочитано
      //message.data.count
    }

    //если то, что пришло имеет поле active = message, то
    //добавляем в этот чат новый объект с этим сообщением для отрисовки
    //у новых сообщений есть флаг
    if (isNewMessage(message)) {

      this.activeChatMessages.set([
        ...this.activeChatMessages(),
        {
          id: message.data.id,
          userFromId: message.data.author,
          personalChatId: message.data.chat_id,
          text: message.data.message,
          createdAt: message.data.created_at,
          isRead: false,
          isMine: false
        }
      ])

      console.log(this.activeChatMessages());
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
        console.log('гет чат бай айди отработал')

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

  sendMessage(chatId: number, message: string) {
    return this.http.post<Message>(
      `${this.messageUrl}send/${chatId}`,
      {},
      {
        params: {
          message,
        },
      }
    )
  }
}

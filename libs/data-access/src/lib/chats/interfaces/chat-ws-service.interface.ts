import {ChatWSMessage} from './chat-ws-message.interface';
import {Observable} from 'rxjs';

//новый интерфейс для создания соединения с вес сокетом
export interface ChatConnectionWSParams {
  //куда коннектимся
  url: string,
  //с каким токеном
  token: string,
  //какой функцией будем обрабатывать ответы сервера
  handleMessage: (message: ChatWSMessage) => void
}

export interface ChatWSSerivce {
  connect: (params: ChatConnectionWSParams) => void | Observable<ChatWSMessage>;
  sendMessage: (text: string, chatId: number) => void;
  disconnect: () => void;
}

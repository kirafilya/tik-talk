import {ChatWSMessage} from './chat-ws-message.interface';

//новый интерфейс для создания соединения с вес сокетом
export interface ChatConnectionWSParams {
  url: string,
  token: string,
  //функция, в которой будет описано, что делать с сообщениями
  handleMessage: (message: ChatWSMessage) => void,
}

export interface ChatWSSerivce {
  connect: (params: ChatConnectionWSParams) => void;
  sendMessage: (text: string, chatId: number) => void;
  disconnect: () => void;
}

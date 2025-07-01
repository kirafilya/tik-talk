import {ChatConnectionWSParams, ChatWSSerivce} from '../interfaces/chat-ws-service.interface';

export class ChatWSNativeService implements ChatWSSerivce {

  // Переменная, в которую сохраняется экземпляр WebSocket-соединения.
  // Используем `null` до момента инициализации соединения.
  #socket: WebSocket | null = null;

  //метод, который вызывается в чат сервисе для проведения соединения
  connect(params: ChatConnectionWSParams) {
    // если сокет не пуст, значит соединение уже создано
    if (this.#socket) return

    // создаем объект сокета, куда мы передаем урл и наш токен доступа
    this.#socket = new WebSocket(params.url, [params.token]);

    //онмеседж - метод сокета, в котором происходит обработка сообщения
    this.#socket.onmessage = (event: MessageEvent): void => {
      params.handleMessage(JSON.parse(event.data));
    }

    //метод, в котором что-то происходит, когда соединение закрываетя
    this.#socket.onclose = (): void => {
      console.log('Соединение закрылось');
    }

  }

  //отправляем сообщение по веб сокету, что нужно передать
  // аргументом, указывается в документации к апи вебсокета
  sendMessage(text: string, chatId: number) {
    console.log('//отправляем сообщение по веб сокету, что нужно передать\n')
    this.#socket?.send(
      JSON.stringify({
        text,
        chat_id: chatId
      })
    )
  }

  //метод, который закрывает соединение с сокетом
  disconnect(): void {
    //сюда можно прописать логику
    //закрывается соединение так, как указано ниже
    this.#socket?.close();
  }
}

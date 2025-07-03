import {ChatConnectionWSParams, ChatWSSerivce} from '../interfaces/chat-ws-service.interface';

export class ChatWSNativeService implements ChatWSSerivce {

  #socket: WebSocket | null = null;

  connect(params: ChatConnectionWSParams) {
    if (this.#socket) return

    this.#socket = new WebSocket(params.url, [params.token]);

    this.#socket.onmessage = (event: MessageEvent): void => {
      console.log('Что-то пришло с сервера');
      params.handleMessage(JSON.parse(event.data));
    }

    this.#socket.onclose = (): void => {
      console.log('Блять, токен опять протух');
    }

  }

  sendMessage(text: string, chatId: number) {
    this.#socket?.send(
      JSON.stringify({
        text,
        chat_id: chatId
      })
    )
  }

  disconnect(): void {
    this.#socket?.close();
  }
}

import {ChatWSMessage, ChatWSNewMessage, ChatWSUnreadMessage} from './chat-ws-message.interface';

//функция для опредления интерфейса, определяет прочитано ли сообщение
export function isUnreadMessage(message: ChatWSMessage): message is ChatWSUnreadMessage {
  return 'action' in message && message.action === 'unread';
}

//функция для опредления интерфейса, определяет новое ли сообщение
export function isNewMessage(message: ChatWSMessage): message is ChatWSNewMessage {
  return 'action' in message && message.action === 'message';
}



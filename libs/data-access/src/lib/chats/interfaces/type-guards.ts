import {ChatWSError, ChatWSMessage, ChatWSNewMessage, ChatWSUnreadMessage} from './chat-ws-message.interface';

//функция для опредления интерфейса, определяет прочитано ли сообщение
export function isUnreadMessage(message: ChatWSMessage): message is ChatWSUnreadMessage {
  return 'action' in message && message.action === 'unread';
}

//функция для опредления интерфейса, определяет новое ли сообщение
export function isNewMessage(message: ChatWSMessage): message is ChatWSNewMessage {
  return 'action' in message && message.action === 'message';
}

export function isChatWSError(message: ChatWSMessage): message is ChatWSError {
  return (
    'status' in message &&
    message.status === 'error' &&
    'message' in message
  );
}


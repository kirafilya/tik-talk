import {Profile} from "../../profile/interfaces/profile";

export interface Chat {
  id: number;
  userFirst: Profile;
  userSecond: Profile;
  messages: Message[];
  companion?: Profile;
}

export interface Message {
  id: number;
  userFromId: number;
  personalChatId: number;
  text: string;
  createdAt: string;
  isRead: boolean;
  updatedAt?: string;
  user: Profile | null;
  isMine?: boolean;
}

export interface LastMessageRes {
  id: number;
  userFrom: Profile;
  message: Message;
  countUnread?: number;
}


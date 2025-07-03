import {AfterViewInit, Component, ElementRef, inject, Renderer2,} from '@angular/core';
import {debounceTime, filter, fromEvent, of, switchMap} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {
  ChatWorkspaceMessagesWrapperComponent
} from './chat-workspace-messages-wrapper/chat-workspace-messages-wrapper.component';
import {ChatWorkspaceHeaderComponent} from './chat-workspace-header/chat-workspace-header.component';
import {ChatsService} from '@tt/data-access';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'app-chat-workspace',
  standalone: true,
  imports: [
    ChatWorkspaceHeaderComponent,
    ChatWorkspaceMessagesWrapperComponent,
    AsyncPipe,

  ],
  templateUrl: './chat-workspace.component.html',
  styleUrl: './chat-workspace.component.scss',
})
export class ChatWorkspaceComponent implements AfterViewInit {
  route = inject(ActivatedRoute);
  router = inject(Router);
  chatsService = inject(ChatsService);

  hostElement = inject(ElementRef);
  r2 = inject(Renderer2);

  messages = this.chatsService.activeChatMessages

  activeChat$ = this.route.params.pipe(
      switchMap(({ id }) => {
        if (id === 'new') {
          return this.route.queryParams.pipe(
            filter(({userId}) => userId),
            switchMap(({userId }) => {
              return this.chatsService.createChats(userId).pipe(
                switchMap(chat => {
                  this.router.navigate(['chats', chat.id])
                  return  of(null);
                })
              )
            }),
          )
        }
        return this.chatsService.getChatById(id);
      })
    );


  ngAfterViewInit(): void {
    this.resizeFeed();

    fromEvent(window, 'resize')
      .pipe(debounceTime(200))
      .subscribe(() => {
        this.resizeFeed();
      });
  }

  resizeFeed() {
    //тут мы задаем стили и местоположение элементу
    const { top } = this.hostElement.nativeElement.getBoundingClientRect();

    const height = window.innerHeight - top - 24;
    this.r2.setStyle(this.hostElement.nativeElement, 'height', `${height}px`);
  }
}

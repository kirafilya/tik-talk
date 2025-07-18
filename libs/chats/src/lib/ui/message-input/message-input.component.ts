import {ChangeDetectionStrategy, Component, EventEmitter, inject, Output, Renderer2,} from '@angular/core';
import {AvatarCircleComponent, SvgIconComponent} from '@tt/common-ui';
import {FormsModule} from '@angular/forms';
import {Store} from '@ngrx/store';
import {selectedMeProfile} from '@tt/data-access';


@Component({
  imports: [AvatarCircleComponent, FormsModule, SvgIconComponent],
  standalone: true,
  selector: 'app-message-input',
  styleUrl: './message-input.component.scss',
  templateUrl: './message-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MessageInputComponent {
  @Output() createdMess = new EventEmitter<string>();

  r2 = inject(Renderer2);

  store = inject(Store);
  me = this.store.selectSignal(selectedMeProfile)();

  textMessage = '';

  onTextAreaInput(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;

    this.r2.setStyle(textarea, 'height', 'auto');
    this.r2.setStyle(textarea, 'height', textarea.scrollHeight + 'px');
  }

  onClick() {
    if (!this.textMessage) return;
    this.createdMess.emit(this.textMessage);
    this.textMessage = '';
    return;
  }
}

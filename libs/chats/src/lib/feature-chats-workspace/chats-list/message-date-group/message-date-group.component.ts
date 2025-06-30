import {Component, input, OnInit, signal} from '@angular/core';

@Component({
  selector: 'app-message-date-group',
  imports: [],
  templateUrl: './message-date-group.component.html',
  styleUrl: './message-date-group.component.scss',
})
export class MessageDateGroupComponent implements OnInit {
  messageDate = input<string>();

  dateVivod = signal<string>('');

  ngOnInit() {
    const dateValue = this.messageDate();

    if (!dateValue) {
      // Если undefined или пустое, обработать ситуацию
      return;
    }

    const dateArr = dateValue.slice(0, 10).split('-');
    const now = new Date();

    const dateObj = {
      year: now.getFullYear().toString(),
      month:
        now.getMonth().toString().length === 1
          ? `0${now.getMonth() + 1}`
          : `${now.getMonth() + 1}`,
      day: now.getDate().toString(),
    };

    const dateMesObj = {
      year: dateArr[0],
      month: dateArr[1],
      day: dateArr[2],
    };

    if (
      dateObj.year === dateMesObj.year &&
      dateObj.month === dateMesObj.month &&
      dateObj.day === dateMesObj.day
    ) {
      return this.dateVivod.set('Сегодня');
    } else if (
      dateObj.year === dateMesObj.year &&
      dateObj.month === dateMesObj.month &&
      dateObj.day === (Number(dateMesObj.day) + 1).toString()
    ) {
      return this.dateVivod.set('Вчера');
    }
    return this.dateVivod.set(
      `${dateMesObj.day}.${dateMesObj.month}.${dateMesObj.year}`
    );
  }
}

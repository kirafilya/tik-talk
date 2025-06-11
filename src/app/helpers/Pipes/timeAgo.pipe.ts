import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'timeAgo'
})
export class TimeAgoPipe implements PipeTransform {

  transform(value: string | null) {

    if (value === null) return;
    const thisDate = new Date(value + 'Z');
    const now = new Date();

    const difference = now.getTime() - thisDate.getTime();


    let result: number;

    if (difference < 3600000) {
      result = Math.floor(difference / 60000);
      return `${result} мин назад`;
    } else if (difference < 86400000 ) {
      result = Math.floor(difference / 3600000);
      return `${result} ч назад`;
    } else {
      result = Math.floor(difference / 86400000 );

      const lastNumber = Number(result.toString().at(-1));
      const lastTwoDigits = result % 100;

      if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
        return `${result} дней назад`;
      } else if (lastNumber === 1) {
        return `${result} день назад`;
      } else if (lastNumber >= 2 && lastNumber <= 4) {
        return `${result} дня назад`;
      } else  {
        return `${result} дней назад`;
      }
    }
  }

}

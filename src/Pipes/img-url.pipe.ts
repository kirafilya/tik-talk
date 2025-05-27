import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'imgUrl'
})
export class ImgUrlPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    if (!value) {
      return null;
    } else {
      return `https://icherniakov.ru/yt-course/${value}`;
    }
  }

}

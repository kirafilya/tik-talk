import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'imgUrl',
  standalone: true,
})
export class ImgUrlPipe implements PipeTransform {
  transform(value: string): string | null {
    if (!value) {
      return '/assets/imgs/avatar-placeholder.png';
    } else {
      return `https://icherniakov.ru/yt-course/${value}`;
    }
  }
}

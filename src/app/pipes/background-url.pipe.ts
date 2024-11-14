import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'asUrl',
})
export class BackgroundUrlPipe implements PipeTransform {
  transform(imageUrl: string): string {
    return `url('${imageUrl}')`;
  }
}

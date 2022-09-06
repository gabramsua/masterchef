import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cutPhonePipe'
})
export class CutPhonePipePipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): string {
    if (!value) { return ''; }
    return '*******' + value.slice(-2);
  }

}

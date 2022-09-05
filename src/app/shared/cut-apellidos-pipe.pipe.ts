import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cutApellidosPipe'
})
export class CutApellidosPipePipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): string {
    if (!value) { return ''; }
    return value[0];
  }

}

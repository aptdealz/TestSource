import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[wowPositiveInteger]',
})
export class WowPositiveIntegerDirective {

  @Input() minValue: number = 0;
  @Input() maxValue: number = 0;

  public constructor(private el: ElementRef) {
    console.log('The WowPositiveIntegerDirective is in action !!!');
  }

  @HostListener('document:keypress', ['$event'])
  onKeyPress(event: any) {
    const oldValue = this.el.nativeElement.value;
    const newKey = event.key;

    if (newKey == '-' || newKey == '+' || newKey == 'e' || newKey == '.') {
      event.preventDefault();
    }

    const newValue = oldValue + newKey;
    const currentValue = parseInt(newValue);

    if (currentValue < this.minValue) {
      event.preventDefault();
    }
    if (currentValue > this.maxValue) {
      event.preventDefault();
    }
  }

}

import {ChangeDetectionStrategy, Component, forwardRef, HostListener, input} from '@angular/core';
import {SvgIconComponent} from '../svg-icon/svg-icon.component';
import {ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule} from '@angular/forms';
import {BehaviorSubject} from 'rxjs';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'tt-stack-input',
  imports: [
    SvgIconComponent,
    FormsModule,
    ReactiveFormsModule,
    AsyncPipe
  ],
  standalone: true,
  templateUrl: './stack-input.component.html',
  styleUrl: './stack-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => StackInputComponent),
    }
  ]
})

export class StackInputComponent implements ControlValueAccessor{
  type = input<'text'>('text');
  placeholder = input<string>();
  // me = input<Profile | undefined>();

  value$ = new BehaviorSubject<string[]>([]);
  #disabled = false;

  // @HostBinding('class.disabled')
  // get disabled(): boolean {
  //   return this.#disabled
  // }

  innerInput = '';

  @HostListener('keydown.enter', ['$event'])
  onEnter(event: KeyboardEvent): void {
    event.stopPropagation();
    event.preventDefault();
    if (this.innerInput === '') return;
    this.value$.next([...this.value$.value, this.innerInput]);
    this.innerInput = '';
    this.onChange(this.value$.value);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn
  }

  setDisabledState(isDisabled: boolean): void {
    // this.#disabled = isDisabled
  }

  writeValue(stack: string[] | null): void {
    if (!stack) {
      this.value$.next([]);
      return;
    }

    this.value$.next(stack);
  }


  onChange(value: string[] | null): void {}

  onTouched(obj: any): void {}

  // onTagDelete(i: number): void {
  //   const tags = this.value$.value;
  //   tags.splice(i, 1)
  //   this.value$.next(tags);
  //   this.onChange(this.value$.value);
  // }

  onTagDelete(i: number) {
    const tags = [...this.value$.value];
    tags.splice(i, 1);
    this.value$.next(tags);
    this.onChange(tags);
  }


}

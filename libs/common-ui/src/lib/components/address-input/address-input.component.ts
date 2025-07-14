import {ChangeDetectionStrategy, Component, forwardRef, inject, input, signal} from '@angular/core';
import {ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule} from '@angular/forms';
import {DadataService} from '../../data';
import {debounceTime, switchMap, tap} from 'rxjs';
import {AsyncPipe} from '@angular/common';
import {TtInputComponent} from '../tt-input/tt-input.component';

@Component({
  selector: 'tt-address-input',
  standalone: true,
  imports: [
    TtInputComponent,
    ReactiveFormsModule,
    AsyncPipe
  ],
  templateUrl: './address-input.component.html',
  styleUrl: './address-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => AddressInputComponent),
    }
  ]
})
export class AddressInputComponent implements ControlValueAccessor{
  type = input<string>('text');
  placeholder = input<string>();

  dadataService = inject(DadataService);

  isDropdownOpened = signal<boolean>(true);

  innerSearchControl = new FormControl();

  suggestions$ = this.innerSearchControl.valueChanges
    .pipe(
      debounceTime(300),
      switchMap(value => {
        return this.dadataService.getSuggestion(value).pipe(
          tap(res => {
            this.isDropdownOpened.set(!!res.length);
          })
        );
      })
    )


  registerOnChange(fn: any): void {
    this.onChange = fn
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn
  }

  setDisabledState?(isDisabled: boolean): void {
  }

  writeValue(city: string): void {
    this.innerSearchControl.patchValue(city, {
       emitEvent: false
    })
  }


  onChange(value: any): void {}

  onTouched(): void {}

  onSuggestionPick(city: string) {
    console.log(city);
    this.isDropdownOpened.set(false);
    this.innerSearchControl.patchValue(city, {
      emitEvent: false
    });
    this.onChange(city);
  }
}

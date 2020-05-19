import { Component, OnInit, Input } from '@angular/core';
import { ValidarCamposService } from '../validar-campos.service';
import { FormGroup, AbstractControl } from '@angular/forms';

@Component({
  selector: 'dio-input-number',
  templateUrl: './input-number.component.html',
  styleUrls: ['./input-number.component.scss']
})
export class InputNumberComponent {

  @Input() titulo: string;
  @Input() formGroup: FormGroup;
  @Input() controlName: string
  @Input() minimo: number = 0;
  @Input() maximo: number = 0;
  @Input() step: number = 1;
  
  constructor(public validacao: ValidarCamposService) { }

  get formControl(): AbstractControl {
    return this.formGroup.controls[this.controlName];
  }

}

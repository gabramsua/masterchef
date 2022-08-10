import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
    selector: 'snackbar',
    template: '<span style="color: white">{{data}}</span>'
  })
export class CustomSnackBarComponent {
    constructor(@Inject(MAT_SNACK_BAR_DATA) public data: string) { }
}
  
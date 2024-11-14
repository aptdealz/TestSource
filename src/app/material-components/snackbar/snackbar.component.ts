import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBar } from '@angular/material/snack-bar';

import { SnackbarData } from '../../models/material-components/snackbar-data.model';

@Component({
  selector: 'app-snackbar',
  templateUrl: './snackbar.component.html',
  styleUrls: ['./snackbar.component.scss'],
})
export class SnackbarComponent {
  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: SnackbarData,
    private snackbar: MatSnackBar
  ) {}

  closeSnackbar(): void {
    this.snackbar.dismiss();
  }
}

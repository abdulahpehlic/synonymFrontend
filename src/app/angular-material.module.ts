

import { NgModule } from '@angular/core';
import { MatButtonModule} from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar'

const modules: any[] = [
    MatButtonModule,
    MatCardModule,
    MatButtonToggleModule,
    MatToolbarModule,
    MatInputModule,
    MatAutocompleteModule,
    MatDialogModule,
    MatDividerModule,
    MatIconModule,
    MatSnackBarModule
];

@NgModule({
  imports: [ ...modules ],
  exports: [ ...modules ]
})
export class AngularMaterialModule {}
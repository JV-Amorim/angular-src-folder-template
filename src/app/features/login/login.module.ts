import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { LoginPanelComponent } from './components/login-panel/login-panel.component';

const materialImports = [
  MatButtonModule,
  MatFormFieldModule,
  MatInputModule,
  MatProgressBarModule
];

@NgModule({
  declarations: [
    LoginPanelComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ...materialImports
  ],
  exports: [
    LoginPanelComponent
  ]
})
export class LoginModule { }

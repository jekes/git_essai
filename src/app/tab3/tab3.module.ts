import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab3Page } from './tab3.page';
import { MatTableModule } from '@angular/material';
import { MatPaginatorModule, MatSortModule, MatIconModule, MatButtonModule } from '@angular/material';
@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule, MatSortModule, MatIconModule, MatButtonModule,
    RouterModule.forChild([{ path: '', component: Tab3Page }])
  ],
  declarations: [Tab3Page]
})
export class Tab3PageModule { }

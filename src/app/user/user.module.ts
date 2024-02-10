import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRoutingComponent } from './user-routing.module';
import { UserInfoComponent } from './user-info/user-info.component';
import { SharedModule } from '../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [UserInfoComponent],
  imports: [
    CommonModule,
    UserRoutingComponent,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class UserModule { }

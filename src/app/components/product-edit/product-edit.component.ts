import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCreateComponent } from '../product-create/product-create.component';

@Component({
  selector: 'app-product-edit',
  standalone: true,
  imports: [CommonModule, ProductCreateComponent],
  template: `<app-product-create [isEditMode]="true"></app-product-create>`
})
export class ProductEditComponent {} 
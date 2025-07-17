import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { ActivatedRoute } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HeaderComponent } from '../header/header.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-product-create',
  standalone: true,
  imports: [CommonModule, FormsModule, MatToolbarModule, MatButtonModule, MatIconModule, HeaderComponent, MatProgressSpinnerModule],
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.css']
})
export class ProductCreateComponent implements OnInit {
  @Input() productToEdit: Product | null = null;
  @Input() isEditMode = false;

  name = '';
  description = '';
  price: number | null = null;
  image: string = '';
  loading = false;
  error = '';
  success = '';

  constructor(
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    if (this.productToEdit) {
      this.name = this.productToEdit.name;
      this.description = this.productToEdit.description;
      this.price = this.productToEdit.price;
      this.image = this.productToEdit.image || '';
    } else if (this.isEditMode) {
      
      const id = this.route.snapshot.paramMap.get('id');
      if (id) {
        this.loading = true;
        this.productService.getProductById(id).subscribe({
          next: (product) => {
            this.name = product.name;
            this.description = product.description;
            this.price = product.price;
            this.image = product.image || '';
            this.loading = false;
          },
          error: (err) => {
            this.error = 'Erro ao carregar produto para edição.';
            this.loading = false;
          }
        });
      }
    }
  }

  submit() {
    this.error = '';
    this.success = '';
    if (!this.name.trim() || !this.description.trim() || this.price === null || this.price <= 0) {
      this.error = 'Preencha todos os campos obrigatórios corretamente.';
      return;
    }
    this.loading = true;
    if (this.isEditMode && this.productToEdit) {
      this.productService.updateProduct(this.productToEdit.id, {
        name: this.name.trim(),
        description: this.description.trim(),
        price: this.price,
        image: this.image.trim() || undefined
      }).subscribe({
        next: () => {
          this.success = 'Produto atualizado com sucesso!';
          setTimeout(() => this.router.navigate(['/products']), 1200);
        },
        error: (err) => {
          this.error = err?.error?.message || 'Erro ao atualizar produto.';
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        }
      });
    } else {
      this.productService.createProduct({
        name: this.name.trim(),
        description: this.description.trim(),
        price: this.price,
        image: this.image.trim() || undefined
      }).subscribe({
        next: () => {
          this.success = 'Produto cadastrado com sucesso!';
          setTimeout(() => this.router.navigate(['/products']), 1200);
        },
        error: (err) => {
          this.error = err?.error?.message || 'Erro ao cadastrar produto.';
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        }
      });
    }
  }
} 
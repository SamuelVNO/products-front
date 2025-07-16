import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Product, ProductFilters } from '../../models/product.model';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { HeaderComponent } from '../header/header.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule, RouterModule, ReactiveFormsModule,
    MatToolbarModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, MatProgressSpinnerModule, MatCardModule, MatGridListModule,
    HeaderComponent, MatSnackBarModule
  ],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  loading = false;
  error = '';
  currentPage = 1;
  totalPages = 1;
  totalProducts = 0;
  itemsPerPage = 12;
  
  filterForm: FormGroup;
  categories: string[] = ['Todos', 'Eletrônicos', 'Livros', 'Roupas', 'Casa', 'Esportes'];
  selectedCategory: string = 'Todos';
  showCategoryDropdown = false;
  private destroy$ = new Subject<void>();
  deletingProductId: string | null = null;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private router: Router,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.filterForm = this.fb.group({
      search: [''],
      category: ['Todos']
    });
  }

  ngOnInit(): void {
    this.loadProducts();
    this.setupFilterSubscription();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupFilterSubscription(): void {
    this.filterForm.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.currentPage = 1;
        this.loadProducts();
      });
  }

  loadProducts(): void {
    this.loading = true;
    this.error = '';

    const filters: ProductFilters = {
      ...this.filterForm.value,
      page: this.currentPage,
      limit: this.itemsPerPage
    };
    // Se categoria for 'Todos', não enviar filtro de categoria
    if (filters.category === 'Todos') {
      delete filters.category;
    }

    this.productService.getProducts(filters)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          response.products.forEach(p => p.price = Number(p.price));
          this.products = response.products;
          this.totalPages = response.totalPages;
          this.totalProducts = response.total;
          this.loading = false;
        },
        error: (error) => {
          this.error = error.message || 'Erro ao carregar produtos';
          this.loading = false;
        }
      });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadProducts();
  }

  onProductClick(productId: string): void {
    this.router.navigate(['/products', productId]);
  }

  addToCart(event: Event, product: Product): void {
    event.stopPropagation();
    this.cartService.addToCart(product, 1);
    this.snackBar.open(`${product.name} adicionado ao carrinho!`, 'Ver Carrinho', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    }).onAction().subscribe(() => {
      this.router.navigate(['/cart']);
    });
  }

  clearFilters(): void {
    this.filterForm.reset();
  }

  onEditProduct(event: Event, productId: string): void {
    event.stopPropagation();
    this.router.navigate(['/products', productId, 'edit']);
  }

  onDeleteProduct(event: Event, productId: string): void {
    event.stopPropagation();
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;
    this.deletingProductId = productId;
    this.productService.deleteProduct(productId).subscribe({
      next: () => {
        this.deletingProductId = null;
        this.loadProducts();
        alert('Produto excluído com sucesso!');
      },
      error: (err) => {
        this.deletingProductId = null;
        alert('Erro ao excluir produto.');
      }
    });
  }

  get pages(): number[] {
    const pages: number[] = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (target) {
      target.style.display = 'none';
    }
  }

  setCategory(category: string): void {
    this.selectedCategory = category;
    this.filterForm.patchValue({ category });
  }
} 
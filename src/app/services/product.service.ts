import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError, map } from 'rxjs';
import { Product, ProductListResponse, ProductFilters } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:3000/products'; // Corrigido para alinhar com a API

  constructor(private http: HttpClient) {}

  getProducts(filters: { search?: string; page?: number; limit?: number } = {}): Observable<ProductListResponse> {
    let params = new HttpParams();
    if (filters.search) params = params.set('search', filters.search);
    if (filters.page) params = params.set('page', filters.page.toString());
    if (filters.limit) params = params.set('limit', filters.limit.toString());

    return this.http.get<any>(this.apiUrl, { params })
      .pipe(
        map(response => ({
          products: response.data,
          total: response.pagination?.total ?? response.data.length,
          page: response.pagination?.page ?? 1,
          limit: response.pagination?.limit ?? 12,
          totalPages: response.pagination?.totalPages ?? 1
        })),
        catchError(this.handleError)
      );
  }

  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  createProduct(product: Omit<Product, 'id'>): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product)
      .pipe(
        catchError(this.handleError)
      );
  }

  updateProduct(id: string, product: Partial<Product>): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product)
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: any) {
    console.error('Erro na requisição:', error);
    return throwError(() => new Error('Ocorreu um erro ao processar sua requisição. Tente novamente.'));
  }
} 
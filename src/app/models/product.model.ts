export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProductListResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProductFilters {
  search?: string;
  page?: number;
  limit?: number;
  category?: string;
} 
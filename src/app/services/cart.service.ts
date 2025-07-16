import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Cart, CartItem } from '../models/cart.model';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartSubject = new BehaviorSubject<Cart>({
    items: [],
    totalItems: 0,
    totalPrice: 0
  });

  public cart$ = this.cartSubject.asObservable();

  constructor() {
    this.loadCartFromStorage();
  }

  addToCart(product: Product, quantity: number = 1): void {
    const currentCart = this.cartSubject.value;
    const existingItem = currentCart.items.find(item => item.product.id === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.totalPrice = existingItem.quantity * existingItem.product.price;
    } else {
      const newItem: CartItem = {
        product: {
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          image: product.image
        },
        quantity,
        totalPrice: product.price * quantity
      };
      currentCart.items.push(newItem);
    }

    this.updateCart(currentCart);
  }

  updateQuantity(productId: string, quantity: number): void {
    const currentCart = this.cartSubject.value;
    const item = currentCart.items.find(item => item.product.id === productId);

    if (item) {
      if (quantity <= 0) {
        this.removeFromCart(productId);
        return;
      }
      item.quantity = quantity;
      item.totalPrice = item.quantity * item.product.price;
      this.updateCart(currentCart);
    }
  }

  removeFromCart(productId: string): void {
    const currentCart = this.cartSubject.value;
    currentCart.items = currentCart.items.filter(item => item.product.id !== productId);
    this.updateCart(currentCart);
  }

  clearCart(): void {
    const emptyCart: Cart = {
      items: [],
      totalItems: 0,
      totalPrice: 0
    };
    this.updateCart(emptyCart);
  }

  private updateCart(cart: Cart): void {
    cart.totalItems = cart.items.reduce((total, item) => total + item.quantity, 0);
    cart.totalPrice = cart.items.reduce((total, item) => total + item.totalPrice, 0);
    
    this.cartSubject.next(cart);
    this.saveCartToStorage(cart);
  }

  private saveCartToStorage(cart: Cart): void {
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  private loadCartFromStorage(): void {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const cart = JSON.parse(savedCart);
        this.cartSubject.next(cart);
      } catch (error) {
        console.error('Erro ao carregar carrinho do localStorage:', error);
        this.clearCart();
      }
    }
  }

  getCartItemCount(): Observable<number> {
    return new Observable(observer => {
      this.cart$.subscribe(cart => {
        observer.next(cart.totalItems);
      });
    });
  }
} 
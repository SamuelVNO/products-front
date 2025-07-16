export interface CartItem {
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    image?: string;
  };
  quantity: number;
  totalPrice: number;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
} 
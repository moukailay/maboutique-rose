import { create } from 'zustand';
import { CartItem, CartState } from '@/types';

interface CartStore extends CartState {
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

export const useCart = create<CartStore>((set, get) => ({
  items: [],
  isOpen: false,

  addItem: (item) => {
    set((state) => {
      const existingItem = state.items.find(i => i.id === item.id);
      if (existingItem) {
        return {
          items: state.items.map(i => 
            i.id === item.id 
              ? { ...i, quantity: i.quantity + 1 }
              : i
          )
        };
      }
      return {
        items: [...state.items, { ...item, quantity: 1 }]
      };
    });
  },

  removeItem: (id) => {
    set((state) => ({
      items: state.items.filter(item => item.id !== id)
    }));
  },

  updateQuantity: (id, quantity) => {
    if (quantity <= 0) {
      get().removeItem(id);
      return;
    }
    set((state) => ({
      items: state.items.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    }));
  },

  clearCart: () => {
    set({ items: [] });
  },

  toggleCart: () => {
    set((state) => ({ isOpen: !state.isOpen }));
  },

  getTotalPrice: () => {
    return get().items.reduce((total, item) => 
      total + (parseFloat(item.price) * item.quantity), 0
    );
  },

  getTotalItems: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0);
  }
}));

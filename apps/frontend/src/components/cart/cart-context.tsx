"use client";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";
import type { Product, ProductVariant } from "@/types";

export interface CartItem {
  id: string;
  productId: string;
  variantId?: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  attributes?: {
    [key: string]: string;
  };
}

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
  isOpen: boolean;
}

type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "SET_IS_OPEN"; payload: boolean };

const CartContext = createContext<{
  state: CartState;
  addItem: (
    product: Product,
    variant?: ProductVariant,
    quantity?: number
  ) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  setIsOpen: (isOpen: boolean) => void;
} | null>(null);

const initialState: CartState = {
  items: [],
  total: 0,
  itemCount: 0,
  isOpen: false,
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItem = state.items.find(
        (item) =>
          item.productId === action.payload.productId &&
          item.variantId === action.payload.variantId
      );

      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === existingItem.id
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          ),
          total: state.total + action.payload.price * action.payload.quantity,
          itemCount: state.itemCount + action.payload.quantity,
        };
      }

      return {
        ...state,
        items: [...state.items, action.payload],
        total: state.total + action.payload.price * action.payload.quantity,
        itemCount: state.itemCount + action.payload.quantity,
      };
    }
    case "REMOVE_ITEM": {
      const item = state.items.find((item) => item.id === action.payload);
      if (!item) return state;

      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
        total: state.total - item.price * item.quantity,
        itemCount: state.itemCount - item.quantity,
      };
    }
    case "UPDATE_QUANTITY": {
      const item = state.items.find((item) => item.id === action.payload.id);
      if (!item) return state;

      const quantityDiff = action.payload.quantity - item.quantity;

      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
        total: state.total + item.price * quantityDiff,
        itemCount: state.itemCount + quantityDiff,
      };
    }
    case "CLEAR_CART":
      return initialState;
    case "SET_IS_OPEN":
      return {
        ...state,
        isOpen: action.payload,
      };
    default:
      return state;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      const { items } = JSON.parse(savedCart);
      dispatch({ type: "CLEAR_CART" });
      items.forEach((item: CartItem) => {
        dispatch({ type: "ADD_ITEM", payload: item });
      });
    }
  }, []);

  // Save cart to localStorage on change
  useEffect(() => {
    const { items, total, itemCount } = state;
    localStorage.setItem("cart", JSON.stringify({ items }));
  }, [state]);

  const addItem = (
    product: Product,
    variant?: ProductVariant,
    quantity: number = 1
  ) => {
    const attributes: { [key: string]: string } = {};
    if (variant?.attributes) {
      for (const [key, value] of Object.entries(variant.attributes)) {
        if (value) {
          attributes[key] = value;
        }
      }
    }

    const cartItem: CartItem = {
      id: variant ? `${product.id}-${variant.id}` : product.id,
      productId: product.id,
      variantId: variant?.id,
      name: product.name,
      price: variant?.price || product.price,
      quantity,
      image: product.images[0]?.url,
      attributes: Object.keys(attributes).length > 0 ? attributes : undefined,
    };

    dispatch({ type: "ADD_ITEM", payload: cartItem });
  };

  const removeItem = (id: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: id });
  };

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  const setIsOpen = (isOpen: boolean) => {
    dispatch({ type: "SET_IS_OPEN", payload: isOpen });
  };

  return (
    <CartContext.Provider
      value={{
        state,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        setIsOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

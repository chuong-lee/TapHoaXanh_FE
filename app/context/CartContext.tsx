"use client";

import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { Cart, CartItem, Product } from "@/types";
import api from "@/lib/axios";
import { useAuth } from "./AuthContext";

interface CartContextType {
  addToCart: (product: Product, quantity?: number) => void;
  cart: CartItem[];
  updateQuantity: (slug: string, quantity: number) => void;
  removeFromCart: (slug: string) => void;
  isCartLoading: boolean;
  setCart: Dispatch<SetStateAction<CartItem[]>>;
  fetchCart: () => Promise<Cart>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { profile } = useAuth();
  const [cart, setCart] = useState<CartItem[]>(JSON.parse(localStorage.getItem("cart_local") || "[]"));
  const [isCartLoading, setIsCartLoading] = useState(true);

  const saveToLocal = (items: CartItem[]) => {
    localStorage.setItem("cart_local", JSON.stringify(items));
    setCart(items);
  };

  const addToCart = (product: Product, quantity: number = 1) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item.product.slug === product.slug
      );

      let updatedCart;
      if (existingIndex !== -1) {
        updatedCart = [...prevCart];
        updatedCart[existingIndex].quantity += quantity;
        updatedCart[existingIndex].total_price =
          updatedCart[existingIndex].quantity *
          (product.price - product.discount);
      } else {
        updatedCart = [
          ...prevCart,
          {
            id: Date.now(),
            product,
            quantity,
            total_price: quantity * (product.price - product.discount),
            slug: product.slug,
          } as CartItem,
        ];
      }
      saveToLocal(updatedCart);
      return updatedCart;
    });
  };

  const removeFromCart = (slug: string) => {
    const updatedCart = cart.filter((item) => !(item.product.slug === slug));
    saveToLocal(updatedCart);
  };

  const updateQuantity = (slug: string, quantity: number) => {
    if (quantity < 1) return;
    const updatedCart = cart.map((item) =>
      item.product.slug === slug ? { ...item, quantity } : item
    );
    saveToLocal(updatedCart);
    
  };

  async function fetchCart() {
    setIsCartLoading(true);
    const cart_local = JSON.parse(localStorage.getItem("cart_local") || "[]");
    const res = await api.get<Cart>("/cart/owned");

    const cartItems = res.data.cartItems;

    const mergedCart = [...cartItems, ...cart_local].reduce<CartItem[]>(
      (acc, item) => {
        const exist = acc.find((i) => i.product.id === item.product.id);
        if (exist) {
          exist.quantity += item.quantity;
        } else {
          acc.push({ ...item });
        }
        return acc;
      },
      []
    );
    saveToLocal(mergedCart);
    setCart(mergedCart);
    setIsCartLoading(false);
    return res.data;
  }

  useEffect(() => {
    if (profile) {
      fetchCart();
    } else {
      setIsCartLoading(false);
    }
  }, [profile]);

  return (
    <CartContext.Provider
      value={{
        fetchCart,
        isCartLoading,
        cart,
        updateQuantity,
        removeFromCart,
        addToCart,
        setCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart phải được sử dụng trong CartProvider");
  return ctx;
};

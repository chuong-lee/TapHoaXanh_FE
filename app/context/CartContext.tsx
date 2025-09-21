"use client";

import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useRef,
} from "react";
import { Cart, CartAction, CartItem, Product } from "@/types";
import api from "@/lib/axios";
import { useAuth } from "./AuthContext";
import debounce from "lodash.debounce";

import { handleError } from "@/helpers/handleError";

interface CartContextType {
  addToCart: (product: Product, quantity?: number) => void;
  cart: CartItem[];
  updateQuantity: (id: number, action: CartAction, quantity?: number) => void;
  removeFromCart: (id: number) => Promise<void>;
  isCartLoading: boolean;
  removeMultipleFromCart: (newId: number[]) => Promise<void>;
  setCart: Dispatch<SetStateAction<CartItem[]>>;
  fetchCart: () => Promise<Cart>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const debouncedUpdate = useRef(
    debounce(async (id: number, quantity?: number) => {
      try {
        await api.put("/cart/update", {
          productIds: [id],
          action: "update",
          quantity: quantity,
        });
      } catch (error: unknown) {
        handleError(error);
        fetchCart();
      }
    }, 500)
  ).current;

  const { profile } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);

  const [isCartLoading, setIsCartLoading] = useState(true);

  const addToCart = async (product: Product, quantity: number = 1) => {
    await api.post("/cart/add", {
      productId: product.id,
      quantity: quantity,
    });

    // Fetch updated cart from database to get correct IDs
    await fetchCart();
  };

  const removeFromCart = async (productId: number) => {
    await api.put("/cart/update", { productIds: productId, action: "remove" });

    // Fetch updated cart from database
    await fetchCart();
  };

  const removeMultipleFromCart = async (cartItemIds: number[]) => {
    // Remove multiple cart items by their database IDs
    for (const id of cartItemIds) {
      await api.put("/cart/update", { productIds: id, action: "remove" });
    }

    // Fetch updated cart from database
    await fetchCart();
  };

  const updateQuantity = (
    id: number,
    action: CartAction,
    quantity?: number
  ) => {
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === id
          ? {
              ...item,
              quantity:
                action === "increase"
                  ? item.quantity + 1
                  : action === "decrease"
                  ? item.quantity - 1
                  : item.quantity,
            }
          : item
      )
    );

    debouncedUpdate(id, quantity);
  };

  async function fetchCart() {
    const res = await api.get<Cart>("/cart/owned");
    setCart(res.data.cartItems);

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
        removeMultipleFromCart,
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

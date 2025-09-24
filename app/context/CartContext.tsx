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

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item.product.id === product.id
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

      return updatedCart;
    });

    await fetchCart();
  };

  const removeFromCart = async (newId: number) => {
    const updatedCart = cart.filter((item) => !(item.product.id === newId));

    await api.put("/cart/update", { productIds: newId, action: "remove" });
    setCart(updatedCart);
    localStorage.setItem("cart_selected", JSON.stringify(updatedCart));
  };

  const removeMultipleFromCart = async (newId: number[]) => {
    const updatedCart = cart.filter((item) => !newId.includes(item.id));
    setCart(updatedCart);
    localStorage.setItem("cart_selected", JSON.stringify(updatedCart));
  };

  const updateQuantity = (
    id: number,
    action: CartAction,
    quantity?: number
  ) => {
    setCart(function (prev) {
      return prev.map(function (item) {
        if (item.product.id === id) {
          if (action === "increase") {
            item.quantity += 1;
          } else if (action === "decrease") {
            item.quantity -= 1;
          } else {
            item.quantity = quantity || item.quantity;
          }

          return {
            ...item,
          };
        } else {
          return item;
        }
      });
    });

    debouncedUpdate(id, quantity);
  };

  async function fetchCart() {
    try {
      const res = await api.get<Cart>("/cart/owned");
      setCart(res.data.cartItems);

      return res.data;
    } finally {
      setIsCartLoading(false);
    }
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

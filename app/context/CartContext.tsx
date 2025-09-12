"use client";
import { toast } from "react-toastify";
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
import axios from "axios";

interface CartContextType {
  addToCart: (product: Product, quantity?: number) => void;
  cart: CartItem[];
  updateQuantity: (id: number, action: CartAction, quantity?: number) => void;
  removeFromCart: (id: number) => Promise<void>;
  isCartLoading: boolean;
  setCart: Dispatch<SetStateAction<CartItem[]>>;
  fetchCart: () => Promise<Cart>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const debouncedUpdate = useRef(
    debounce(async (id: number, action: CartAction, quantity?: number) => {
      try {
        await api.put("/cart/update", { productId: id, action, quantity });
      } catch (error: unknown) {
        const messages = "An unknown error occurred";

        if (axios.isAxiosError(error)) {
          return error.response?.data?.message;
        }
        toast(messages, {
          type: "error",
        });
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
  };

  const removeFromCart = async (id: number) => {
    const updatedCart = cart.filter((item) => !(item.product.id === id));

    await api.put("/cart/update", {
      productId: id,
      quantity: 0,
    });

    setCart(updatedCart);
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
                  : quantity ?? item.quantity,
            }
          : item
      )
    );

    debouncedUpdate(id, action, quantity);
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

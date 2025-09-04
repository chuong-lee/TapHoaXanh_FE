'use client'
import { useEffect, useState, useRef } from "react"
import api from "../lib/axios"

export type CartItem = {
  id: number
  name: string
  price: number
  quantity: number
  images: string
  discount: number
  description: string
  variant_id?: number
  variant_name?: string
  stock?: number
}

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [_selected, setSelected] = useState<{ id: number; variant_id: number | undefined }[]>([]);
  const prevCartLength = useRef(cart.length);

  useEffect(() => {
    const local = localStorage.getItem("cart_local")
    if (local) {
      let parsed: CartItem[] = []
      try {
        parsed = JSON.parse(local)
        // Lọc bỏ các sản phẩm mẫu nếu có
        parsed = parsed.filter(item => item.id !== 9 && item.id !== 1)
        setCart(parsed)
        // Ghi đè lại localStorage nếu có sản phẩm mẫu
        localStorage.setItem("cart_local", JSON.stringify(parsed))
      } catch {
        setCart([])
        localStorage.removeItem("cart_local")
      }
    }
  }, [])

  useEffect(() => {
    if (cart.length !== prevCartLength.current) {
      setSelected(cart.map(item => ({ id: item.id, variant_id: item.variant_id })));
      prevCartLength.current = cart.length;
    }
  }, [cart]);

  const saveToLocal = (items: CartItem[]) => {
    localStorage.setItem("cart_local", JSON.stringify(items))
    setCart(items)
  }

  const addToCart = (product: Omit<CartItem, "quantity">, quantity: number = 1) => {
    setCart(prevCart => {
      const existingIndex = prevCart.findIndex(
        item => item.id === product.id && item.variant_id === product.variant_id
      );
      let updatedCart;
      if (existingIndex !== -1) {
        updatedCart = [...prevCart];
        updatedCart[existingIndex].quantity += quantity;
      } else {
        updatedCart = [...prevCart, { ...product, quantity }];
      }
      saveToLocal(updatedCart); // <-- Thêm dòng này
      return updatedCart;
    });
  }

  const removeFromCart = (id: number, variant_id?: number) => {
    const updatedCart = cart.filter((item) => !(item.id === id && item.variant_id === variant_id));
    saveToLocal(updatedCart);
  };

  const updateQuantity = (id: number, variant_id: number | undefined, quantity: number) => {
    if (quantity < 1) return;
    const updatedCart = cart.map(item =>
      item.id === id && item.variant_id === variant_id
        ? { ...item, quantity }
        : item
    );
    saveToLocal(updatedCart);
  };

  const syncWithDatabase = async () => {
    try {
      await api.post("/api/cart/sync", cart)
      localStorage.removeItem("cart_local")
    } catch (error) {
      console.error("Sync giỏ hàng thất bại:", error)
    }
  }

  return { cart, addToCart, removeFromCart, updateQuantity, syncWithDatabase }
}

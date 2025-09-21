'use client'
import { useEffect, useState, useRef } from "react"
import api from "../lib/axios"
import { handleError } from "@/helpers/handleError"

export type CartItem = {
  id: number
  name: string
  price: number
  quantity: number
  slug: string
  images: string
  discount: number
  description: string
  variant_id?: number
  variant_name?: string
  stock?: number
}

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([
    {
      id: 1,
      name: "Rau củ hữu cơ",
      price: 45000,
      quantity: 1,
      slug: "rau-cu-huu-co",
      images: "https://res.cloudinary.com/dlrqjti9s/image/upload/v1756114017/product-1_r3zkho.jpg",
      discount: 10,
      description: "Rau củ hữu cơ tươi ngon, an toàn.",
      stock: 0,
    },
    {
      id: 2,
      name: "Xúc xích C.P.",
      price: 38250,
      quantity: 1,
      slug: "xuc-xich-cp",
      images: "https://res.cloudinary.com/dlrqjti9s/image/upload/v1756114016/product-3_j3ivmo.jpg",
      discount: 15,
      description: "Xúc xích thơm ngon, dễ chế biến.",
      stock: 0,
    },
    {
      id: 3,
      name: "Bánh mì sandwich",
      price: 19000,
      quantity: 1,
      slug: "banh-mi-sandwich",
      images: "https://res.cloudinary.com/dlrqjti9s/image/upload/v1756114016/product-5_mdoz1g.jpg",
      discount: 5,
      description: "Bánh mì sandwich mềm, tiện lợi.",
      stock: 0,
    },
  ]);
  const [_selected, setSelected] = useState<{ slug: string; variant_id: number | undefined }[]>([]);
  const prevCartLength = useRef(cart.length);

  useEffect(() => {
    const local = localStorage.getItem("cart_local")
    if (local) {
      let parsed: CartItem[] = []
      try {
        parsed = JSON.parse(local)
        // Lọc bỏ các sản phẩm mẫu nếu có
        parsed = parsed.filter(item => item.slug !== 'SPM9' && item.slug !== 'SPM1')
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
      setSelected(cart.map(item => ({ slug: item.slug, variant_id: item.variant_id })));
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
        item => item.slug === product.slug && item.variant_id === product.variant_id
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

  const removeFromCart = (slug: string) => {
    const updatedCart = cart.filter((item) => !(item.slug === slug));
    saveToLocal(updatedCart);
  };

  const updateQuantity = (slug: string, quantity: number) => {
    if (quantity < 1) return;
    const updatedCart = cart.map(item =>
      item.slug === slug
        ? { ...item, quantity }
        : item
    );
    saveToLocal(updatedCart);
  };

  const syncWithDatabase = async () => {
    try {
      await api.post("/cart/sync", cart)
      localStorage.removeItem("cart_local")
    } catch (error: unknown) {
      handleError(error);
    }
  }

  return { cart, addToCart, removeFromCart, updateQuantity, syncWithDatabase }
}

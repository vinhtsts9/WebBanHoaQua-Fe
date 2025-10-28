import React, { createContext, useContext, useMemo, useState } from "react";
import type { Product } from "../types";

export type CartItem = {
  ma_sp: number;
  ten_sp: string;
  don_gia?: number;
  qty: number;
};

type CartContextValue = {
  items: CartItem[];
  addItem: (p: Product, qty?: number) => void;
  removeItem: (ma_sp: number) => void;
  clear: () => void;
  totalQty: number;
  totalPrice: number;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (p: Product, qty = 1) => {
    setItems((prev) => {
      const found = prev.find((it) => it.ma_sp === p.ma_sp);
      if (found) {
        return prev.map((it) => (it.ma_sp === p.ma_sp ? { ...it, qty: it.qty + qty } : it));
      }
      return [...prev, { ma_sp: p.ma_sp, ten_sp: p.ten_sp, don_gia: p.don_gia, qty }];
    });
  };

  const removeItem = (ma_sp: number) => {
    setItems((prev) => prev.filter((it) => it.ma_sp !== ma_sp));
  };

  const clear = () => setItems([]);

  const totalQty = useMemo(() => items.reduce((s, i) => s + i.qty, 0), [items]);
  const totalPrice = useMemo(() => items.reduce((s, i) => s + (i.don_gia || 0) * i.qty, 0), [items]);

  const value: CartContextValue = { items, addItem, removeItem, clear, totalQty, totalPrice };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

export default CartContext;

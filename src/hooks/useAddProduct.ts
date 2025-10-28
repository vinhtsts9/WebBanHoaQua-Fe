import { useState } from "react";
import * as api from "../api";
import type { Product } from "../types";

export function useAddProduct(
  onSuccess?: (product: Omit<Product, "ma_sp">) => void
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addProduct = async (product: Omit<Product, "ma_sp">) => {
    setLoading(true);
    setError(null);

    try {
      await api.createProduct(product);
      onSuccess?.(product);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Có lỗi xảy ra khi thêm sản phẩm"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    addProduct,
    loading,
    error,
  };
}

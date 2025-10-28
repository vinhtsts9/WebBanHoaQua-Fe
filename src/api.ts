import type {
  Product,
  StockItem,
  ImportPayload,
  Invoice,
  InvoiceItem,
  APIError,
} from "./types";

const BASE = (import.meta.env.VITE_API_BASE_URL as string) || "";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { Accept: "application/json", ...(init?.headers || {}) },
    ...init,
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const err: APIError =
      data && data.message
        ? data
        : { message: res.statusText || "Request failed", code: res.status };
    throw err;
  }

  return data as T;
}

/* Products */
export const getProducts = () => request<Product[]>("/sanpham");
export const getProduct = (id: number) => request<Product>(`/sanpham/${id}`);
export const createProduct = (payload: Partial<Product>) =>
  request<Product>("/sanpham", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
export const updateProduct = (id: number, payload: Partial<Product>) =>
  request<Product>(`/sanpham/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
export const deleteProduct = (id: number) =>
  request<void>(`/sanpham/${id}`, { method: "DELETE" });

/* Imports (Nhập hàng) */
export const getImports = () => request<any[]>("/nhap");
export const createImport = (payload: ImportPayload) =>
  request<any>("/nhap", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

/* Stock (Kho hàng) */
export const getStock = () => request<StockItem[]>("/kho");
export const getStockItem = (ma_sp: number) =>
  request<StockItem>(`/kho/${ma_sp}`);
export const updateStock = (ma_sp: number, so_luong: number) =>
  request<StockItem>(`/kho/${ma_sp}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ so_luong }),
  });

/* Invoices (Hóa đơn) */
export const getInvoices = () => request<Invoice[]>("/hoadon");
export const createInvoice = (payload: Partial<Invoice> = {}) =>
  request<Invoice>("/hoadon", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
export const getInvoice = (ma_hd: number) =>
  request<Invoice>(`/hoadon/${ma_hd}`);

/* Invoice details (Chi tiết hóa đơn) */
export const addInvoiceItem = (ma_hd: number, item: InvoiceItem) =>
  request<any>(`/hoadon/${ma_hd}/chitiet`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item),
  });

export default {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getImports,
  createImport,
  getStock,
  getStockItem,
  updateStock,
  getInvoices,
  createInvoice,
  getInvoice,
  addInvoiceItem,
};

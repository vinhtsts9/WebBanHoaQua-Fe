export interface Product {
  ma_sp: number;
  ten_sp: string;
  don_vi?: string;
  don_gia?: number;
  danh_muc?: string;
  mo_ta?: string;
  hinh_anh?: string;
}

export interface StockItem {
  ma_sp: number;
  ten_sp: string;
  so_luong: number;
}

export interface ImportPayload {
  ma_sp: number;
  so_luong: number;
}

export interface InvoiceItem {
  ma_sp: number;
  so_luong: number;
  don_gia: number;
  thanh_tien?: number;
}

export interface Invoice {
  ma_hd: number;
  ngay?: string;
  tong_tien: number;
  items?: InvoiceItem[];
}

export interface APIError {
  message: string;
  code?: number | string;
}

import React, { useEffect, useState } from "react";
import * as api from "../api";
import type { Invoice, InvoiceItem } from "../types";

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [selected, setSelected] = useState<Invoice | null>(null);

  const load = async () => {
    const res = await api.getInvoices();
    setInvoices(res || []);
  };

  useEffect(() => {
    load();
  }, []);

  const create = async () => {
    const hd = await api.createInvoice();
    await load();
    setSelected(hd);
  };

  const loadDetail = async (ma_hd: number) => {
    const inv = await api.getInvoice(ma_hd);
    setSelected(inv);
  };

  const addItem = async (ma_hd: number, item: InvoiceItem) => {
    await api.addInvoiceItem(ma_hd, item);
    const inv = await api.getInvoice(ma_hd);
    setSelected(inv);
    await load();
  };

  return (
    <div>
      <h2>Hóa đơn</h2>
      <div style={{ display: "flex", gap: 16 }}>
        <div style={{ width: 320 }}>
          <button onClick={create}>Tạo hóa đơn mới</button>
          <ul>
            {invoices.map((i) => (
              <li
                key={i.ma_hd}
                style={{ cursor: "pointer" }}
                onClick={() => loadDetail(i.ma_hd)}
              >
                #{i.ma_hd} — Tổng: {i.tong_tien?.toLocaleString() ?? 0}
              </li>
            ))}
            {invoices.length === 0 && <li>Không có hóa đơn</li>}
          </ul>
        </div>

        <div style={{ flex: 1 }}>
          {selected ? (
            <InvoiceDetail invoice={selected} onAddItem={addItem} />
          ) : (
            <div>Chọn hóa đơn để xem chi tiết</div>
          )}
        </div>
      </div>
    </div>
  );
}

function InvoiceDetail({
  invoice,
  onAddItem,
}: {
  invoice: Invoice;
  onAddItem: (ma_hd: number, item: InvoiceItem) => Promise<void>;
}) {
  const [ma_sp, setMaSp] = useState<number | "">("");
  const [so_luong, setSoLuong] = useState<number>(1);
  const [don_gia, setDonGia] = useState<number>(0);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    api.getProducts().then((p) => setProducts(p || []));
  }, []);

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (ma_sp === "") return;
    await onAddItem(invoice.ma_hd, {
      ma_sp: Number(ma_sp),
      so_luong: Number(so_luong),
      don_gia: Number(don_gia),
    });
    setMaSp("");
    setSoLuong(1);
    setDonGia(0);
  };

  return (
    <div>
      <h3>Hóa đơn #{invoice.ma_hd}</h3>
      <div>Tổng: {invoice.tong_tien?.toLocaleString() ?? 0}</div>

      <h4>Thêm mặt hàng</h4>
      <form
        onSubmit={submit}
        style={{ display: "flex", gap: 8, alignItems: "center" }}
      >
        <select
          value={ma_sp}
          onChange={(e) =>
            setMaSp(e.target.value === "" ? "" : Number(e.target.value))
          }
        >
          <option value="">--Chọn sản phẩm--</option>
          {products.map((p: any) => (
            <option key={p.ma_sp} value={p.ma_sp}>
              {p.ten_sp}
            </option>
          ))}
        </select>
        <input
          type="number"
          min={1}
          value={so_luong}
          onChange={(e) => setSoLuong(Number(e.target.value))}
          style={{ width: 80 }}
        />
        <input
          type="number"
          min={0}
          value={don_gia}
          onChange={(e) => setDonGia(Number(e.target.value))}
          style={{ width: 120 }}
        />
        <button type="submit">Thêm</button>
      </form>

      <h4>Chi tiết</h4>
      <table style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>Tên</th>
            <th>Số lượng</th>
            <th>Đơn giá</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items?.map((it) => (
            <tr key={`${it.ma_sp}-${Math.random()}`}>
              <td>{it.ma_sp}</td>
              <td style={{ textAlign: "right" }}>{it.so_luong}</td>
              <td style={{ textAlign: "right" }}>
                {it.don_gia?.toLocaleString()}
              </td>
            </tr>
          )) || (
            <tr>
              <td colSpan={3}>Không có mặt hàng</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

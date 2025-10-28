import { useEffect, useState } from "react";
import * as api from "../api";
import type { StockItem } from "../types";

export default function StockPage() {
  const [items, setItems] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.getStock();
      setItems(res || []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const [updateQuantity, setUpdateQuantity] = useState("");

  const handleUpdateStock = async (productId: number, quantity: number) => {
    setLoading(true);
    try {
      await api.updateStock(productId, quantity);
      await load(); // Reload data after update
      setSelectedItem(null);
      setUpdateQuantity("");
    } catch (error) {
      alert("Không thể cập nhật số lượng. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: 1200, margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <h2 style={{ margin: 0 }}>Quản lý tồn kho</h2>
        <button
          onClick={load}
          style={{
            padding: "8px 16px",
            background: "#fff",
            border: "1px solid #ddd",
            borderRadius: 4,
          }}
        >
          🔄 Làm mới
        </button>
      </div>

      <div
        style={{
          background: "#fff",
          borderRadius: 8,
          padding: 20,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        {loading ? (
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            Đang tải...
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #eee" }}>
                <th style={{ padding: "12px 8px", textAlign: "left" }}>
                  Sản phẩm
                </th>
                <th style={{ padding: "12px 8px", textAlign: "right" }}>
                  Tồn kho
                </th>
                <th style={{ padding: "12px 8px", textAlign: "center" }}>
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr
                  key={item.ma_sp}
                  style={{ borderBottom: "1px solid #f0f0f0" }}
                >
                  <td style={{ padding: "12px 8px" }}>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 12 }}
                    >
                      {item.ten_sp}
                    </div>
                  </td>
                  <td style={{ padding: "12px 8px", textAlign: "right" }}>
                    {item.so_luong.toLocaleString()}
                  </td>
                  <td style={{ padding: "12px 8px", textAlign: "center" }}>
                    {selectedItem === item.ma_sp ? (
                      <div
                        style={{
                          display: "flex",
                          gap: 8,
                          justifyContent: "center",
                        }}
                      >
                        <input
                          type="number"
                          value={updateQuantity}
                          onChange={(e) => setUpdateQuantity(e.target.value)}
                          style={{
                            width: 80,
                            padding: "4px 8px",
                            border: "1px solid #d9d9d9",
                            borderRadius: 4,
                          }}
                          placeholder="Thêm/bớt"
                        />
                        <button
                          onClick={() => {
                            const quantity = parseInt(updateQuantity);
                            if (!isNaN(quantity)) {
                              handleUpdateStock(item.ma_sp, quantity);
                            }
                          }}
                          style={{
                            padding: "4px 8px",
                            background: "#2b6a32",
                            color: "#fff",
                            border: "none",
                            borderRadius: 4,
                          }}
                        >
                          Cập nhật
                        </button>
                        <button
                          onClick={() => {
                            setSelectedItem(null);
                            setUpdateQuantity("");
                          }}
                          style={{
                            padding: "4px 8px",
                            background: "#fff",
                            border: "1px solid #d9d9d9",
                            borderRadius: 4,
                          }}
                        >
                          Hủy
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setSelectedItem(item.ma_sp)}
                        style={{
                          padding: "4px 12px",
                          background: "#fff",
                          border: "1px solid #d9d9d9",
                          borderRadius: 4,
                        }}
                      >
                        Điều chỉnh
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td
                    colSpan={3}
                    style={{
                      textAlign: "center",
                      padding: "40px 20px",
                      color: "#666",
                    }}
                  >
                    Chưa có sản phẩm nào trong kho
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

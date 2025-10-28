import { useState } from "react"; // Bỏ import React vì không cần
import type { Product } from "../types";
import { useCart } from "../context/CartContext";
import { getProductImage } from "../assets/images";

export default function ProductPage({
  product,
  onBack,
}: {
  product: Product | null;
  onBack: () => void;
}) {
  const cart = useCart();
  const [qty, setQty] = useState(1);

  if (!product) {
    return (
      <div>
        <h2>Sản phẩm không tìm thấy</h2>
        <button onClick={onBack} style={{ padding: "6px 10px" }}>
          Quay lại
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 8,
        padding: 16,
        boxShadow: "0 6px 18px rgba(0,0,0,0.04)",
      }}
    >
      <button
        onClick={onBack}
        style={{ marginBottom: 12, padding: "6px 10px" }}
      >
        ← Quay lại
      </button>
      <div style={{ display: "flex", gap: 16 }}>
        <div
          style={{
            width: 260,
            height: 260,
            borderRadius: 8,
            background: "#fff8f0",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src={getProductImage(product.ten_sp)}
            alt={product.ten_sp}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
          />
        </div>
        <div style={{ flex: 1 }}>
          <h2 style={{ margin: 0 }}>{product.ten_sp}</h2>
          <div style={{ color: "#6b6b6b", marginTop: 6 }}>
            {product.don_vi || ""}
          </div>
          <div style={{ marginTop: 12, fontWeight: 700, color: "#b04a2c" }}>
            {product.don_gia
              ? product.don_gia.toLocaleString() + "₫"
              : "Liên hệ"}
          </div>

          <p style={{ marginTop: 12 }}>
            Đây là trang chi tiết sản phẩm (demo). Bạn có thể bổ sung mô tả chi
            tiết, nguồn gốc, hình ảnh, và các thuộc tính khác từ API.
          </p>

          <div
            style={{
              display: "flex",
              gap: 8,
              alignItems: "center",
              marginTop: 12,
            }}
          >
            <input
              type="number"
              value={qty}
              min={1}
              onChange={(e) => setQty(Math.max(1, Number(e.target.value || 1)))}
              style={{ width: 100, padding: 8 }}
            />
            <button
              onClick={() => cart.addItem(product, qty)}
              style={{
                padding: "8px 12px",
                background: "#2b6a32",
                color: "#fff",
                border: "none",
                borderRadius: 6,
              }}
            >
              Thêm vào giỏ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

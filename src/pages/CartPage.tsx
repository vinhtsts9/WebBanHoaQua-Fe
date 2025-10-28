import { useCart } from "../context/CartContext";
import { getProductImage } from "../assets/images";

export default function CartPage({
  onNavigateToProduct,
}: {
  onNavigateToProduct: (masp: number) => void;
}) {
  const cart = useCart();

  if (cart.items.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "40px 20px" }}>
        <h2>Giỏ hàng trống</h2>
        <p style={{ color: "#666" }}>
          Hãy thêm sản phẩm vào giỏ để tiến hành đặt hàng
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", maxWidth: 800, margin: "0 auto" }}>
      <h2>Giỏ hàng của bạn</h2>

      <div
        style={{
          background: "#fff",
          borderRadius: 8,
          padding: 16,
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        }}
      >
        {cart.items.map((item) => (
          <div
            key={item.ma_sp}
            style={{
              display: "flex",
              padding: "12px 0",
              borderBottom: "1px solid #eee",
              gap: 16,
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: 8,
                overflow: "hidden",
                flexShrink: 0,
              }}
            >
              <img
                src={getProductImage(item.ten_sp)}
                alt={item.ten_sp}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>

            <div
              style={{ flex: 1, cursor: "pointer" }}
              onClick={() => onNavigateToProduct(item.ma_sp)}
            >
              <div style={{ fontWeight: 500 }}>{item.ten_sp}</div>
              <div style={{ color: "#666", fontSize: 14, marginTop: 4 }}>
                Số lượng: {item.qty}
              </div>
            </div>

            <div
              style={{
                width: 120,
                textAlign: "right",
                fontWeight: 500,
                color: "#b04a2c",
              }}
            >
              {((item.don_gia || 0) * item.qty).toLocaleString()}₫
            </div>

            <button
              onClick={() => cart.removeItem(item.ma_sp)}
              style={{
                padding: "4px 8px",
                border: "1px solid #ddd",
                background: "#fff",
                borderRadius: 4,
                color: "#666",
              }}
            >
              ×
            </button>
          </div>
        ))}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 20,
            padding: "20px 0 0",
            borderTop: "1px solid #eee",
          }}
        >
          <div>
            <div style={{ fontWeight: 500 }}>Tổng tiền</div>
            <div style={{ color: "#666", fontSize: 14, marginTop: 4 }}>
              {cart.totalQty} sản phẩm
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div style={{ fontSize: 20, fontWeight: 600, color: "#b04a2c" }}>
              {cart.totalPrice.toLocaleString()}₫
            </div>
            <button
              onClick={() => {
                alert("Tính năng thanh toán sẽ được phát triển sau!");
                cart.clear();
              }}
              style={{
                padding: "12px 24px",
                background: "#2b6a32",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                fontWeight: 500,
              }}
            >
              Đặt hàng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

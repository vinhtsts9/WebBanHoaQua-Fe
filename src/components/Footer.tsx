import React from "react";

export default function Footer() {
  return (
    <footer
      style={{
        marginTop: 24,
        padding: 18,
        borderTop: "1px solid #eee",
        background: "#fafafa",
      }}
    >
      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <div>
          <h4 style={{ margin: 0, color: "#2b6a32" }}>Liên hệ với chúng tôi</h4>
          <div style={{ marginTop: 6 }}>
            Địa chỉ: 123 Đường Trái Cây, Quận 1, TP. HCM
          </div>
          <div>Điện thoại: 0858 255 679</div>
          <div>Email: info@freshfruits.example</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div>Giờ mở cửa: 8:00 - 20:00 (T2 - CN)</div>
          <div style={{ marginTop: 8 }}>
            © {new Date().getFullYear()} Fresh Fruits
          </div>
        </div>
      </div>
    </footer>
  );
}

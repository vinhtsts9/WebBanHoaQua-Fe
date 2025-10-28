export default function Header({
  onNavigate,
}: {
  onNavigate: (r: string) => void;
}) {
  const navStyle: React.CSSProperties = {
    display: "flex",
    gap: 12,
    padding: 12,
    borderBottom: "1px solid #eee",
    alignItems: "center",
  };
  const btnStyle: React.CSSProperties = {
    padding: "6px 10px",
    cursor: "pointer",
  };

  return (
    <header style={navStyle}>
      <div style={{ fontWeight: 800, color: "#2b6a32" }}>FRESH FRUITS</div>
      <nav style={{ display: "flex", gap: 8, marginLeft: 12 }}>
        <button style={btnStyle} onClick={() => onNavigate("home")}>
          Trang chủ
        </button>
        <button style={btnStyle} onClick={() => onNavigate("products")}>
          Sản phẩm
        </button>
        <button style={btnStyle} onClick={() => onNavigate("stock")}>
          Kho hàng
        </button>
        <button style={btnStyle} onClick={() => onNavigate("import")}>
          Nhập hàng
        </button>
        <button style={btnStyle} onClick={() => onNavigate("invoices")}>
          Hóa đơn
        </button>
      </nav>
      <div style={{ flex: 1 }} />
    </header>
  );
}

import { useState } from "react";
import "./App.css";
import HomePage from "./pages/HomePage";
import InvoicesPage from "./pages/InvoicesPage";
import { CartProvider, useCart } from "./context/CartContext";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import AddProductPage from "./pages/AddProductPage";
import StockPage from "./pages/StockPage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import type { Product } from "./types";
// import * as api from "./api"; // Đã chuyển logic vào hooks

type Route =
  | "home"
  | "products"
  | "product"
  | "stock"
  | "import"
  | "invoices"
  | "cart";

function App() {
  const [route, setRoute] = useState<Route>("home");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // header styles were moved into Header component; remove unused constants

  return (
    <div
      style={{
        fontFamily: "Segoe UI, Roboto, sans-serif",
        maxWidth: "100%",
        margin: "24px auto",
      }}
    >
      <Header onNavigate={(r) => setRoute(r as Route)} />

      <main style={{ padding: 12 }}>
        <CartProvider>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: 12,
            }}
          >
            <CartSummary onOpen={() => setRoute("cart")} />
          </div>
          {route === "home" && (
            <HomePage
              onProductClick={(p: Product) => {
                setSelectedProduct(p);
                setRoute("product");
              }}
            />
          )}
          {route === "invoices" && <InvoicesPage />}
          {route === "product" && (
            <ProductPage
              product={selectedProduct}
              onBack={() => setRoute("home")}
            />
          )}
          {route === "cart" && (
            <CartPage
              onNavigateToProduct={(masp) => {
                const cartContext = useCart();
                // Tìm sản phẩm theo mã để hiển thị chi tiết
                const cartItem = cartContext.items.find(
                  (item) => item.ma_sp === masp
                );
                if (cartItem) {
                  setSelectedProduct({
                    ma_sp: cartItem.ma_sp,
                    ten_sp: cartItem.ten_sp,
                    don_gia: cartItem.don_gia,
                  });
                  setRoute("product");
                }
              }}
            />
          )}
          {route === "stock" && <StockPage />}
          {route === "import" && (
            <AddProductPage
              onSave={() => setRoute("import")}
              onCancel={() => setRoute("home")}
            />
          )}
        </CartProvider>
      </main>
      <Footer />
    </div>
  );
}

export default App;

function CartSummary({ onOpen }: { onOpen: () => void }) {
  const cart = useCart();
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div>
        Giỏ: <strong>{cart.totalQty}</strong> sp
      </div>
      <div style={{ fontWeight: 700 }}>{cart.totalPrice.toLocaleString()}₫</div>
      <button
        onClick={onOpen}
        style={{
          padding: "6px 12px",
          background: cart.totalQty > 0 ? "#2b6a32" : "#ddd",
          color: cart.totalQty > 0 ? "#fff" : "#666",
          border: "none",
          borderRadius: 4,
          cursor: cart.totalQty > 0 ? "pointer" : "default",
        }}
      >
        Xem giỏ hàng
      </button>
    </div>
  );
}

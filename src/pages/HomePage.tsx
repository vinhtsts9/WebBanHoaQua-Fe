import { useEffect, useMemo, useRef, useState } from "react";
import * as api from "../api";
import type { Product } from "../types";
import mockProducts from "../mocks/mockProducts";
import { getProductImage, fruitHero } from "../assets/images";

export default function HomePage({
  onProductClick,
}: {
  onProductClick?: (p: Product) => void;
}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [q, setQ] = useState("");
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const productsRef = useRef<HTMLDivElement | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("Tất cả");

  function handleCategoryClick(c: string) {
    setActiveCategory(c);
    if (c === "Tất cả") setQ("");
    else setQ(c);
    setSuggestions([]);
    // smooth scroll into products area (slight timeout to allow layout changes)
    setTimeout(() => {
      productsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 80);
  }

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    api
      .getProducts()
      .then((res) => {
        if (!mounted) return;
        // if backend returns nothing, use mock products so the UI is previewable
        setProducts(res && res.length ? res : mockProducts);
      })
      .catch(() => {
        // fallback to mock data for demo when API fails
        if (mounted) setProducts(mockProducts);
      })
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return products;
    return products.filter((p) => p.ten_sp.toLowerCase().includes(s));
  }, [products, q]);

  useEffect(() => {
    if (!q) {
      setSuggestions([]);
      return;
    }
    const s = q.trim().toLowerCase();
    const list = products
      .filter((p) => p.ten_sp.toLowerCase().includes(s))
      .slice(0, 6);
    setSuggestions(list);
  }, [q, products]);

  const categories = [
    "Tất cả",
    "Táo",
    "Cam",
    "Chuối",
    "Dâu",
    "Nho",
    "Xoài",
    "Trái cây nhập khẩu",
  ];

  return (
    <div
      style={{
        gap: 16,
        padding: "18px 12px",
        width: "100%", // ✅ full chiều ngang
        boxSizing: "border-box", // tránh tràn viền
      }}
    >
      <div
        style={{
          background: "linear-gradient(90deg, #f9ffd6, #d6ffd9)", // nền sáng, hợp hoa quả
          padding: "24px 16px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            // allow the main search/hero container to expand more on wide screens
            // previously capped at 1100px which constrained wide layouts
            width: "min(1400px, 96%)",
            display: "flex",
            alignItems: "center",
            background: "#fff",
            borderRadius: 999,
            padding: "10px 14px",
            boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
          }}
        >
          <div
            style={{
              width: 36,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#9aa0a6",
              fontSize: 18,
            }}
          >
            🔍
          </div>

          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Tìm trái cây tươi ngon..."
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              fontSize: 16,
              padding: "6px 10px",
              color: "#333",
              background: "transparent",
            }}
          />

          <button
            onClick={() => {
              /* noop */
            }}
            style={{
              marginLeft: 8,
              padding: "8px 16px",
              background: "#2b6a32",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            Tìm
          </button>
        </div>
      </div>

      <div style={{ display: "flex", gap: 16, padding: "18px 12px" }}>
        <aside style={{ width: "18%", minWidth: 200 }}>
          <div
            style={{
              background: "#fff",
              borderRadius: 6,
              padding: 12,
              boxShadow: "0 6px 18px rgba(0,0,0,0.04)",
            }}
          >
            <h4 style={{ marginTop: 0, marginBottom: 8 }}>Danh mục</h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {categories.map((c) => (
                <li
                  key={c}
                  onClick={() => handleCategoryClick(c)}
                  style={{
                    padding: "10px 6px",
                    borderBottom: "1px dashed #eee",
                    cursor: "pointer",
                    background:
                      activeCategory === c ? "#f6fff6" : "transparent",
                    fontWeight: activeCategory === c ? 700 : 400,
                    color: activeCategory === c ? "#2b6a32" : "inherit",
                  }}
                >
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <section style={{ flex: 1 }}>
          <div style={{ display: "flex", gap: 12 }}>
            <div
              style={{
                flex: 2,
                borderRadius: 8,
                overflow: "hidden",
                minHeight: 220,
                background: "linear-gradient(90deg,#ffe9d6,#fff5ed)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src={fruitHero}
                alt="Hoa quả tươi mỗi ngày"
                style={{
                  width: "98%",
                  height: "98%",
                  objectFit: "cover",
                }}
              />
            </div>

            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <div
                style={{
                  background: "#fff",
                  borderRadius: 8,
                  padding: 12,
                  minHeight: 100,
                  boxShadow: "0 6px 18px rgba(0,0,0,0.04)",
                }}
              >
                Ưu đãi hôm nay
                <br />
                <strong>Giảm tới 30%</strong>
              </div>
              <div
                style={{
                  background: "#fff",
                  borderRadius: 8,
                  padding: 12,
                  minHeight: 100,
                  boxShadow: "0 6px 18px rgba(0,0,0,0.04)",
                }}
              >
                Giao nhanh
                <br />
                <strong>Trong 4 giờ</strong>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
            <div
              style={{
                flex: 1,
                height: 160,
                background: "#fff",
                borderRadius: 8,
                boxShadow: "0 6px 18px rgba(0,0,0,0.04)",
                overflow: "hidden", // Đảm bảo ảnh không tràn ra ngoài
              }}
            >
              <img
                src="/src/assets/images/tao-7230-1616121379.jpg"
                alt="Banner trái cây 1"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover", // Ảnh sẽ lấp đầy khung mà không bị méo
                }}
              />
            </div>
            <div
              style={{
                flex: 1,
                height: 160,
                background: "#fff",
                borderRadius: 8,
                boxShadow: "0 6px 18px rgba(0,0,0,0.04)",
                overflow: "hidden",
              }}
            >
              <img
                src="/src/assets/images/0006.jpg_wh860.jpg"
                alt="Banner trái cây 2"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
            <div
              style={{
                flex: 1,
                height: 160,
                background: "#fff",
                borderRadius: 8,
                boxShadow: "0 6px 18px rgba(0,0,0,0.04)",
                overflow: "hidden",
              }}
            >
              <img
                src="/src/assets/images/download.jpg"
                alt="Banner trái cây 3"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
          </div>
        </section>
      </div>
      <div style={{ marginTop: 18 }} ref={productsRef}>
        <h3
          style={{
            borderBottom: "3px solid #ffd6b3",
            display: "inline-block",
            paddingBottom: 6,
          }}
        >
          Sản phẩm mới
        </h3>
        <div style={{ marginTop: 12 }}>
          {loading ? (
            <div>Đang tải...</div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: 12,
              }}
            >
              {filtered.slice(0, 12).map((p) => (
                <div
                  key={p.ma_sp}
                  style={{
                    background: "#fff",
                    borderRadius: 8,
                    padding: 12,
                    textAlign: "center",
                    boxShadow: "0 6px 18px rgba(0,0,0,0.04)",
                    transition: "transform 180ms ease, box-shadow 180ms ease",
                    cursor: "pointer",
                  }}
                  onClick={() => onProductClick && onProductClick(p)}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.transform = "translateY(-8px)";
                    el.style.boxShadow = "0 16px 40px rgba(0,0,0,0.12)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.transform = "translateY(0)";
                    el.style.boxShadow = "0 6px 18px rgba(0,0,0,0.04)";
                  }}
                >
                  <div
                    style={{
                      height: 160,
                      marginBottom: 12,
                      borderRadius: 4,
                      overflow: "hidden",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "#f8f8f8",
                    }}
                  >
                    <img
                      src={getProductImage(p.ten_sp)}
                      alt={p.ten_sp}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                  <div style={{ fontWeight: 600, marginTop: 8 }}>
                    {p.ten_sp}
                  </div>
                  <div style={{ color: "#6b6b6b", marginTop: 6 }}>
                    {p.don_vi || "-"}
                  </div>
                  <div
                    style={{
                      marginTop: 10,
                      fontWeight: 700,
                      color: "#b04a2c",
                    }}
                  >
                    {p.don_gia ? p.don_gia.toLocaleString() + "₫" : "Liên hệ"}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{ height: 40 }} />
    </div>
  );
}

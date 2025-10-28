import React, { useState } from "react";
import type { Product } from "../types";
import { useAddProduct } from "../hooks/useAddProduct";

interface AddProductPageProps {
  onSave: () => void;
  onCancel: () => void;
}

export default function AddProductPage({
  onSave,
  onCancel,
}: AddProductPageProps) {
  const [formData, setFormData] = useState({
    ten_sp: "",
    don_gia: "",
    don_vi: "",
    danh_muc: "",
    mo_ta: "",
    ton_kho: "",
    image: null as File | null,
  });

  const [imagePreview, setImagePreview] = useState<string>("");

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.ten_sp.trim()) {
      newErrors.ten_sp = "Vui lòng nhập tên sản phẩm";
    }

    if (!formData.don_gia) {
      newErrors.don_gia = "Vui lòng nhập đơn giá";
    } else if (
      isNaN(Number(formData.don_gia)) ||
      Number(formData.don_gia) <= 0
    ) {
      newErrors.don_gia = "Đơn giá phải là số dương";
    }

    if (!formData.don_vi.trim()) {
      newErrors.don_vi = "Vui lòng nhập đơn vị tính";
    }

    if (!formData.danh_muc.trim()) {
      newErrors.danh_muc = "Vui lòng chọn danh mục";
    }

    if (!formData.image) {
      newErrors.image = "Vui lòng chọn ảnh sản phẩm";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const {
    addProduct,
    loading,
    error: apiError,
  } = useAddProduct((product) => {
    alert(`Đã thêm sản phẩm ${product.ten_sp}`);
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validate()) {
      try {
        const formDataToSend = new FormData();
        formDataToSend.append("ten_sp", formData.ten_sp);
        formDataToSend.append("don_gia", formData.don_gia);
        formDataToSend.append("don_vi", formData.don_vi);
        formDataToSend.append("danh_muc", formData.danh_muc);
        formDataToSend.append("mo_ta", formData.mo_ta);
        if (formData.image) {
          formDataToSend.append("image", formData.image);
        }

        await addProduct({
          ten_sp: formData.ten_sp,
          don_gia: Number(formData.don_gia),
          don_vi: formData.don_vi,
          danh_muc: formData.danh_muc,
          mo_ta: formData.mo_ta,
          hinh_anh: formData.image
            ? URL.createObjectURL(formData.image)
            : undefined,
        });

        // Reset form khi thành công
        setFormData({
          ten_sp: "",
          don_gia: "",
          don_vi: "",
          danh_muc: "",
          mo_ta: "",
          ton_kho: "",
          image: null,
        });
        setImagePreview("");
      } catch (error) {
        // Error sẽ được hiển thị qua apiError state
      }
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        setErrors((prev) => ({
          ...prev,
          image: "Kích thước ảnh không được vượt quá 5MB",
        }));
        return;
      }

      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          image: "File phải là ảnh (jpg, png, gif)",
        }));
        return;
      }

      setFormData((prev) => ({
        ...prev,
        image: file,
      }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Clear error if exists
      if (errors.image) {
        setErrors((prev) => ({
          ...prev,
          image: "",
        }));
      }
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <h2 style={{ margin: 0 }}>Thêm sản phẩm mới</h2>
        <button
          onClick={onCancel}
          style={{
            padding: "8px 16px",
            background: "#fff",
            border: "1px solid #ddd",
            borderRadius: 4,
          }}
        >
          ← Quay lại
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div
          style={{
            background: "#fff",
            padding: 24,
            borderRadius: 8,
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <div style={{ marginBottom: 16 }}>
            <label
              style={{ display: "block", marginBottom: 8, fontWeight: 500 }}
            >
              Tên sản phẩm
            </label>
            <input
              type="text"
              name="ten_sp"
              value={formData.ten_sp}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "8px 12px",
                border: "1px solid " + (errors.ten_sp ? "#ff4d4f" : "#d9d9d9"),
                borderRadius: 4,
              }}
              placeholder="VD: Táo Fuji"
            />
            {errors.ten_sp && (
              <div style={{ color: "#ff4d4f", fontSize: 14, marginTop: 4 }}>
                {errors.ten_sp}
              </div>
            )}
          </div>

          <div style={{ marginBottom: 16 }}>
            <label
              style={{ display: "block", marginBottom: 8, fontWeight: 500 }}
            >
              Danh mục
            </label>
            <select
              name="danh_muc"
              value={formData.danh_muc}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "8px 12px",
                border:
                  "1px solid " + (errors.danh_muc ? "#ff4d4f" : "#d9d9d9"),
                borderRadius: 4,
              }}
            >
              <option value="">-- Chọn danh mục --</option>
              <option value="trai_cay">Trái cây</option>
              <option value="rau_cu">Rau củ</option>
              <option value="do_kho">Đồ khô</option>
            </select>
            {errors.danh_muc && (
              <div style={{ color: "#ff4d4f", fontSize: 14, marginTop: 4 }}>
                {errors.danh_muc}
              </div>
            )}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
              marginBottom: 16,
            }}
          >
            <div>
              <label
                style={{ display: "block", marginBottom: 8, fontWeight: 500 }}
              >
                Đơn giá
              </label>
              <input
                type="number"
                name="don_gia"
                value={formData.don_gia}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border:
                    "1px solid " + (errors.don_gia ? "#ff4d4f" : "#d9d9d9"),
                  borderRadius: 4,
                }}
                placeholder="VD: 25000"
              />
              {errors.don_gia && (
                <div style={{ color: "#ff4d4f", fontSize: 14, marginTop: 4 }}>
                  {errors.don_gia}
                </div>
              )}
            </div>

            <div>
              <label
                style={{ display: "block", marginBottom: 8, fontWeight: 500 }}
              >
                Đơn vị tính
              </label>
              <input
                type="text"
                name="don_vi"
                value={formData.don_vi}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border:
                    "1px solid " + (errors.don_vi ? "#ff4d4f" : "#d9d9d9"),
                  borderRadius: 4,
                }}
                placeholder="VD: kg, hộp"
              />
              {errors.don_vi && (
                <div style={{ color: "#ff4d4f", fontSize: 14, marginTop: 4 }}>
                  {errors.don_vi}
                </div>
              )}
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <label
              style={{ display: "block", marginBottom: 8, fontWeight: 500 }}
            >
              Mô tả
            </label>
            <textarea
              name="mo_ta"
              value={formData.mo_ta}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "8px 12px",
                border: "1px solid #d9d9d9",
                borderRadius: 4,
                minHeight: 100,
                resize: "vertical",
              }}
              placeholder="Nhập mô tả chi tiết về sản phẩm..."
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label
              style={{ display: "block", marginBottom: 8, fontWeight: 500 }}
            >
              Hình ảnh sản phẩm
            </label>
            <div
              style={{
                border: "2px dashed " + (errors.image ? "#ff4d4f" : "#d9d9d9"),
                borderRadius: 4,
                padding: 20,
                textAlign: "center",
                cursor: "pointer",
                position: "relative",
                background: "#fafafa",
              }}
              onClick={() => document.getElementById("imageInput")?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                e.stopPropagation();
                e.currentTarget.style.background = "#f0f0f0";
                e.currentTarget.style.borderColor = "#2b6a32";
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                e.stopPropagation();
                e.currentTarget.style.background = "#fafafa";
                e.currentTarget.style.borderColor = errors.image
                  ? "#ff4d4f"
                  : "#d9d9d9";
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                e.currentTarget.style.background = "#fafafa";
                e.currentTarget.style.borderColor = errors.image
                  ? "#ff4d4f"
                  : "#d9d9d9";

                const file = e.dataTransfer.files[0];
                if (file) {
                  if (file.size > 5 * 1024 * 1024) {
                    setErrors((prev) => ({
                      ...prev,
                      image: "Kích thước ảnh không được vượt quá 5MB",
                    }));
                    return;
                  }

                  if (!file.type.startsWith("image/")) {
                    setErrors((prev) => ({
                      ...prev,
                      image: "File phải là ảnh (jpg, png, gif)",
                    }));
                    return;
                  }

                  setFormData((prev) => ({
                    ...prev,
                    image: file,
                  }));

                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setImagePreview(reader.result as string);
                  };
                  reader.readAsDataURL(file);

                  if (errors.image) {
                    setErrors((prev) => ({
                      ...prev,
                      image: "",
                    }));
                  }
                }
              }}
            >
              <input
                type="file"
                id="imageInput"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />

              {imagePreview ? (
                <div style={{ position: "relative" }}>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "200px",
                      borderRadius: 4,
                    }}
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFormData((prev) => ({ ...prev, image: null }));
                      setImagePreview("");
                    }}
                    style={{
                      position: "absolute",
                      top: -10,
                      right: -10,
                      background: "#ff4d4f",
                      color: "white",
                      border: "none",
                      borderRadius: "50%",
                      width: 24,
                      height: 24,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    ×
                  </button>
                </div>
              ) : (
                <div>
                  <div style={{ marginBottom: 8, color: "#666" }}>
                    Kéo thả ảnh vào đây hoặc click để chọn
                  </div>
                  <div style={{ fontSize: 12, color: "#999" }}>
                    Hỗ trợ JPG, PNG, GIF (Tối đa 5MB)
                  </div>
                </div>
              )}
            </div>
            {errors.image && (
              <div style={{ color: "#ff4d4f", fontSize: 14, marginTop: 4 }}>
                {errors.image}
              </div>
            )}
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
            <button
              type="button"
              onClick={onCancel}
              style={{
                padding: "8px 16px",
                background: "#fff",
                border: "1px solid #d9d9d9",
                borderRadius: 4,
              }}
            >
              Hủy
            </button>
            <button
              type="submit"
              style={{
                padding: "8px 24px",
                background: "#2b6a32",
                color: "#fff",
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
              }}
            >
              Thêm sản phẩm
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

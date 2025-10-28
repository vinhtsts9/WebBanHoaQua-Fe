// Import tất cả ảnh
import taoImage from "./tao-7230-1616121379.jpg";
import fruitHero from "./hoa-qua-tuoi-ngon.webp";
import mixFruit from "./0006.jpg_wh860.jpg";
import fruitBanner from "./download.jpg";

// Ánh xạ tên sản phẩm với ảnh tương ứng
export function getProductImage(name: string): string {
  const n = name.toLowerCase();
  if (n.includes("táo")) return taoImage;
  // Nếu không có ảnh cụ thể, dùng ảnh chung
  return mixFruit;
}

// Export ảnh hero và banner để dùng ở các phần khác
export { fruitHero, fruitBanner };
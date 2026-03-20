export type ProductCategory = "personalCare" | "electronics" | "homeGoods";

export interface SampleProduct {
  id: string;
  name: string;
  description: string;
  priceCents: number;
  category: ProductCategory;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  isTrending: boolean;
  stock: number;
}

export const SAMPLE_PRODUCTS: SampleProduct[] = [
  // Personal Care
  {
    id: "pc-001",
    name: "CeraVe Moisturizing Cream",
    description:
      "Developed with dermatologists, this non-greasy moisturizing cream provides 24-hour hydration with hyaluronic acid and ceramides. Perfect for dry to very dry skin.",
    priceCents: 1499,
    category: "personalCare",
    imageUrl: "https://picsum.photos/seed/cream/400/400",
    rating: 4.8,
    reviewCount: 2341,
    isFeatured: true,
    isTrending: true,
    stock: 87,
  },
  {
    id: "pc-002",
    name: "Dove Deep Moisture Body Wash",
    description:
      "Gentle, sulfate-free body wash with NutriumMoisture technology. Leaves skin noticeably softer and smoother after just one use.",
    priceCents: 899,
    category: "personalCare",
    imageUrl: "https://picsum.photos/seed/bodywash/400/400",
    rating: 4.6,
    reviewCount: 1876,
    isFeatured: false,
    isTrending: true,
    stock: 124,
  },
  {
    id: "pc-003",
    name: "Neutrogena Hydro Boost Serum",
    description:
      "Lightweight water gel serum with hyaluronic acid that instantly quenches dry skin and keeps it looking smooth, supple and hydrated all day.",
    priceCents: 2199,
    category: "personalCare",
    imageUrl: "https://picsum.photos/seed/serum/400/400",
    rating: 4.7,
    reviewCount: 943,
    isFeatured: true,
    isTrending: false,
    stock: 56,
  },
  {
    id: "pc-004",
    name: "Pantene Pro-V Repair & Protect",
    description:
      "Advanced shampoo with Pro-Vitamin formula that repairs damage and protects hair from future breakage. Suitable for all hair types.",
    priceCents: 999,
    category: "personalCare",
    imageUrl: "https://picsum.photos/seed/shampoo/400/400",
    rating: 4.5,
    reviewCount: 1234,
    isFeatured: false,
    isTrending: false,
    stock: 200,
  },
  // Electronics
  {
    id: "el-001",
    name: "Sony WF-1000XM5 Earbuds",
    description:
      "Industry-leading noise canceling with Auto NC Optimizer. Up to 8 hours battery life plus 16 hours with case. Crystal clear call quality.",
    priceCents: 7999,
    category: "electronics",
    imageUrl: "https://picsum.photos/seed/earbuds/400/400",
    rating: 4.9,
    reviewCount: 3201,
    isFeatured: true,
    isTrending: true,
    stock: 34,
  },
  {
    id: "el-002",
    name: "Anker 65W USB-C GaN Charger",
    description:
      "Compact 3-port charger with PowerIQ 4.0 technology. Charge your laptop, phone, and tablet simultaneously at full speed.",
    priceCents: 2999,
    category: "electronics",
    imageUrl: "https://picsum.photos/seed/charger/400/400",
    rating: 4.7,
    reviewCount: 5678,
    isFeatured: false,
    isTrending: true,
    stock: 150,
  },
  {
    id: "el-003",
    name: "Logitech MX Master 3S Mouse",
    description:
      "Advanced wireless mouse with MagSpeed scrolling, ergonomic design, and 8000 DPI for precision on any surface including glass.",
    priceCents: 9999,
    category: "electronics",
    imageUrl: "https://picsum.photos/seed/mouse/400/400",
    rating: 4.8,
    reviewCount: 2890,
    isFeatured: true,
    isTrending: false,
    stock: 67,
  },
  {
    id: "el-004",
    name: "Kindle Paperwhite 11th Gen",
    description:
      "The thinnest, lightest Kindle Paperwhite ever with a flush-front design and 300 ppi glare-free display. Waterproof for worry-free reading.",
    priceCents: 13999,
    category: "electronics",
    imageUrl: "https://picsum.photos/seed/kindle/400/400",
    rating: 4.9,
    reviewCount: 7821,
    isFeatured: false,
    isTrending: true,
    stock: 89,
  },
  // Home Goods
  {
    id: "hg-001",
    name: "400-Thread Sateen Bed Sheet Set",
    description:
      "Premium 100% Egyptian cotton sateen sheets. Silky smooth, temperature-regulating, and available in 12 colors. Includes flat, fitted, and 2 pillowcases.",
    priceCents: 4999,
    category: "homeGoods",
    imageUrl: "https://picsum.photos/seed/bedsheets/400/400",
    rating: 4.7,
    reviewCount: 1567,
    isFeatured: true,
    isTrending: false,
    stock: 45,
  },
  {
    id: "hg-002",
    name: "Himalayan Salt Aromatherapy Diffuser",
    description:
      "Ultrasonic essential oil diffuser with warm Himalayan salt glow, 7-color LED ambiance, and whisper-quiet operation for up to 8 hours.",
    priceCents: 3499,
    category: "homeGoods",
    imageUrl: "https://picsum.photos/seed/diffuser/400/400",
    rating: 4.6,
    reviewCount: 892,
    isFeatured: false,
    isTrending: true,
    stock: 72,
  },
  {
    id: "hg-003",
    name: "Hydro Flask 32oz Wide Mouth Bottle",
    description:
      "Double-wall vacuum insulation keeps drinks cold 24 hours and hot 12 hours. Durable stainless steel with TempShield technology and a lifetime warranty.",
    priceCents: 4499,
    category: "homeGoods",
    imageUrl: "https://picsum.photos/seed/waterbottle/400/400",
    rating: 4.9,
    reviewCount: 9012,
    isFeatured: true,
    isTrending: true,
    stock: 108,
  },
  {
    id: "hg-004",
    name: "Cuisinart 12-Piece Knife Block Set",
    description:
      "Professional-grade stainless steel knives with ergonomic handles and a sleek bamboo block. Precision-forged for lasting sharpness.",
    priceCents: 5999,
    category: "homeGoods",
    imageUrl: "https://picsum.photos/seed/knifeset/400/400",
    rating: 4.8,
    reviewCount: 3456,
    isFeatured: false,
    isTrending: false,
    stock: 33,
  },
];

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  personalCare: "Personal Care",
  electronics: "Electronics",
  homeGoods: "Home Goods",
};

export const CATEGORY_ICONS: Record<ProductCategory, string> = {
  personalCare: "💆",
  electronics: "📱",
  homeGoods: "🏠",
};

export const CATEGORY_DESCRIPTIONS: Record<ProductCategory, string> = {
  personalCare: "Skincare, haircare & wellness essentials",
  electronics: "Gadgets, accessories & smart devices",
  homeGoods: "Kitchen, bedroom & living essentials",
};

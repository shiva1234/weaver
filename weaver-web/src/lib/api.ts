// src/lib/api.ts
const API_BASE =
(typeof window === 'undefined'
? process.env.SERVER_SIDE_API_BASE_URL
: process.env.NEXT_PUBLIC_API_BASE_URL) ?? 'http://localhost:18080';

/** Domain types */
export type Product = {
  id: string; // UUID
  name: string;
  description: string;
  categoryId: string; // UUID
  vendorPrice: number;
  sellPrice: number;
  stockQty: number;
  sku: string;
  active: boolean;
  images: string[];
  primaryImage: string;
  material?: string;
  careInstructions?: string;
  ratingAvg: number;
  ratingCount: number;
  tags?: string[];
  specifications?: Record<string, string>;
  // Optional UI fields
  badge?: string;
};

export type Category = {
  id: string; // UUID
  name: string;
};

export type ProductQuery = {
  page?: number;           // 1-based
  size?: number;
  sort?: string;           // e.g. "sellPrice"
  dir?: 'asc' | 'desc';
  query?: string;
  minPrice?: number;
  maxPrice?: number;
  categoryId?: string;
};

/** Normalized page returned to the UI */
export type PageResponse<T> = {
  content: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};

/** Helper: build query string */
function toSearch(params: Record<string, unknown>): string {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null || v === '') return;
    qs.set(k, String(v));
  });
  return qs.toString();
}

/** GET paged products (with optional filters) */
export async function getProducts(params: ProductQuery = {}): Promise<PageResponse<Product>> {
  const qs = toSearch(params);
  const url = `${API_BASE}/api/products?${qs}`;

  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) {
      throw new Error(`API ${res.status}: ${await res.text()}`);
    }
    return res.json();
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Unknown error';
    throw new Error(msg);
  }
}

/** GET one */
export async function getProduct(id: string): Promise<Product> {
  const res = await fetch(`${API_BASE}/api/products/${id}`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`GET /products/${id} ${res.status}: ${await res.text()}`);
  return res.json();
}

/** CREATE (Multipart) */
export async function createProduct(product: Omit<Product, 'id' | 'images' | 'primaryImage'>, files: File[]): Promise<Product> {
  const formData = new FormData();

  // Append product JSON
  formData.append('product', new Blob([JSON.stringify(product)], { type: 'application/json' }));

  // Append files
  files.forEach(file => {
    formData.append('files', file);
  });

  const res = await fetch(`${API_BASE}/api/products`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) throw new Error(`POST /products ${res.status}: ${await res.text()}`);
  return res.json();
}

/** UPDATE (full) */
export async function updateProduct(id: string, body: Partial<Product>): Promise<Product> {
  const res = await fetch(`${API_BASE}/api/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`PUT /products/${id} ${res.status}: ${await res.text()}`);
  return res.json();
}

/** DELETE */
export async function deleteProduct(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/api/products/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(`DELETE /products/${id} ${res.status}: ${await res.text()}`);
}

/** GET all categories */
export async function getCategories(): Promise<Category[]> {
  const res = await fetch(`${API_BASE}/api/categories`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`GET /categories ${res.status}: ${await res.text()}`);
  return res.json();
}
// src/lib/api.ts
const API_BASE =
process.env.NEXT_PUBLIC_API_BASE?.replace(/\/+$/, '') ?? 'http://localhost:18080';

/** Domain types */
export type Product = {
  id: number;
  name: string;
  image: string;
  quantity: number;
  price: number;
  weight: number;
  description: string;
};

export type ProductQuery = {
  page?: number;           // 1-based
  size?: number;
  sort?: string;           // e.g. "price"
  dir?: 'asc' | 'desc';
  query?: string;
  minPrice?: number;
  maxPrice?: number;
  // add more filters as needed (color[], fabric[], etc.)
};

/** API page shapes your backend might return */
type PageContent<T> = {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext?: boolean;
  hasPrev?: boolean;
};

type PageItems<T> = {
  items: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNext?: boolean;
  hasPrev?: boolean;
};

export type ApiPage<T> = PageContent<T> | PageItems<T>;

/** Normalized page returned to the UI */
export type PageResponse<T> = {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};

function normalizePage<T>(r: ApiPage<T>): PageResponse<T> {
  if ('content' in r) {
    return {
      content: r.content,
      page: r.page,
      size: r.size,
      totalElements: r.totalElements,
      totalPages: r.totalPages,
      hasNext: r.hasNext ?? r.page < r.totalPages,
      hasPrev: r.hasPrev ?? r.page > 1,
    };
  }
  // items-shape
  return {
    content: r.items,
    page: r.page,
    size: r.pageSize,
    totalElements: r.totalItems,
    totalPages: r.totalPages,
    hasNext: r.hasNext ?? r.page < r.totalPages,
    hasPrev: r.hasPrev ?? r.page > 1,
  };
}

/** Helper: build query string */
function toSearch(params: Record<string, any>): string {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null || v === '') return;
    qs.set(k, String(v));
  });
  return qs.toString();
}

/** GET paged products (with optional filters) */
export async function getProducts(params: ProductQuery = {}): Promise<PageResponse<Product>> {
  const url = `${API_BASE}/api/products?${toSearch(params)}`;
  const res = await fetch(url, { cache: 'no-store' /*, credentials: 'include'*/ });
  if (!res.ok) throw new Error(`GET /products ${res.status}: ${await res.text()}`);
  const raw: ApiPage<Product> = await res.json();
  return normalizePage(raw);
}

/** GET one */
export async function getProduct(id: number): Promise<Product> {
  const res = await fetch(`${API_BASE}/api/products/${id}`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`GET /products/${id} ${res.status}: ${await res.text()}`);
  return res.json();
}

/** CREATE */
export async function createProduct(body: Omit<Product, 'id'>): Promise<Product> {
  const res = await fetch(`${API_BASE}/api/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    // credentials: 'include',
  });
  if (!res.ok) throw new Error(`POST /products ${res.status}: ${await res.text()}`);
  return res.json();
}

/** UPDATE (full) */
export async function updateProduct(id: number, body: Omit<Product, 'id'>): Promise<Product> {
  const res = await fetch(`${API_BASE}/api/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`PUT /products/${id} ${res.status}: ${await res.text()}`);
  return res.json();
}

/** DELETE */
export async function deleteProduct(id: number): Promise<void> {
  const res = await fetch(`${API_BASE}/api/products/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(`DELETE /products/${id} ${res.status}: ${await res.text()}`);
}
const BASE_URL = "http://localhost:5000/api";

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || "Something went wrong");
  }

  return data;
}

// The login/register response may not include the email, but the customer just
// typed it. Add it, so the rest of the app always knows who is logged in.
const withEmail = (data, payload) => {
  const email = payload?.email;
  if (!email || !data || typeof data !== "object") return data;

  const out = { ...data };
  if (!out.email) out.email = email;

  ["customer", "user"].forEach((key) => {
    if (out[key] && typeof out[key] === "object" && !out[key].email) {
      out[key] = { ...out[key], email };
    }
  });

  return out;
};

export const api = {
  // orders
  placeOrder: (payload) =>
    request("/orders", { method: "POST", body: JSON.stringify(payload) }),
  getOrders: (email, customerId) => {
    const q = new URLSearchParams();
    if (email) q.set("email", email);
    if (customerId) q.set("customerId", customerId);
    const s = q.toString();
    return request(s ? `/orders?${s}` : "/orders");
  },
  updateOrderStatus: (id, status) =>
    request(`/orders/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),

  // customers
  registerCustomer: async (payload) =>
    withEmail(
      await request("/customers/register", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
      payload
    ),
  loginCustomer: async (payload) =>
    withEmail(
      await request("/customers/login", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
      payload
    ),
  getCustomers: () => request("/customers"),
  getProfile: (email) =>
    request(`/customers/profile?email=${encodeURIComponent(email)}`),

  // admin
  loginAdmin: (payload) =>
    request("/admin/login", { method: "POST", body: JSON.stringify(payload) }),

  // dashboard
  getDashboardStats: () => request("/dashboard/stats"),

  // sales analytics
  getSalesSummary: () => request("/sales/summary"),

  // products
  getProducts: (category) =>
    request(category ? `/products?category=${encodeURIComponent(category)}` : "/products"),
  getRecommended: () => request("/products/recommended"),
  addProduct: (payload) =>
    request("/products", { method: "POST", body: JSON.stringify(payload) }),
  updateProduct: (id, payload) =>
    request(`/products/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  deleteProduct: (id) =>
    request(`/products/${id}`, { method: "DELETE" }),

  // contact
  sendContact: (payload) =>
    request("/contact", { method: "POST", body: JSON.stringify(payload) }),
};
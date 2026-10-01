import React, { createContext, useContext, useState } from "react";

const CartContext = createContext(null);

const WEIGHTS = [
  { label: "100g", multiplier: 0.1 },
  { label: "200g", multiplier: 0.2 },
  { label: "500g", multiplier: 0.5 },
  { label: "750g", multiplier: 0.75 },
  { label: "1kg", multiplier: 1 },
];

export function CartProvider({ children }) {
  const [cart, setCart] = useState({}); // key: `${category}_${id}_${wtIdx}`
  const [confirm, setConfirm] = useState(null);

  const getCartKey = (category, id, wtIdx) => `${category}_${id}_${wtIdx}`;

  const cartItems = Object.values(cart);
  const cartCount = cartItems.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cartItems.reduce((s, i) => s + i.qty * i.totalPrice, 0);

  const doAdd = (product, category, wtIdx, weightLabel, unitPrice, qty, maxStock) => {
    const key = getCartKey(category, product.id, wtIdx);
    setCart((prev) => ({
      ...prev,
      [key]: prev[key]
        ? { ...prev[key], qty: prev[key].qty + qty, maxStock }
        : { ...product, key, category, wtIdx, weight: weightLabel, totalPrice: unitPrice, qty, maxStock },
    }));
  };

  const addToCart = (product, category, wtIdx, weightLabel, unitPrice, qty = 1, availableStock = null) => {
    const key = getCartKey(category, product.id, wtIdx);
    const alreadyInCart = cart[key]?.qty || 0;

    if (availableStock !== null) {
      const remaining = availableStock - alreadyInCart;

      if (remaining <= 0) {
        return { status: "out", message: `Out of stock: ${product.name} (${weightLabel})` };
      }

      if (qty > remaining) {
        setConfirm({
          mode: "add",
          product, category, wtIdx, weightLabel, unitPrice,
          requestedQty: qty, availableQty: remaining, maxStock: availableStock,
        });
        return { status: "confirm" };
      }
    }

    doAdd(product, category, wtIdx, weightLabel, unitPrice, qty, availableStock);
    return { status: "ok" };
  };

  const incrementCartItem = (key) => {
    const item = cart[key];
    if (!item) return;

    if (item.maxStock !== null && item.maxStock !== undefined && item.qty >= item.maxStock) {
      setConfirm({
        mode: "increment",
        product: item, category: item.category, wtIdx: item.wtIdx,
        weightLabel: item.weight, unitPrice: item.totalPrice,
        requestedQty: item.qty + 1, availableQty: item.maxStock,
        maxStock: item.maxStock, existingKey: key,
      });
      return;
    }

    changeCartQty(key, 1);
  };

  const confirmYes = () => {
    if (!confirm) return;

    if (confirm.mode === "increment") {
      setCart((prev) => ({
        ...prev,
        [confirm.existingKey]: { ...prev[confirm.existingKey], qty: confirm.availableQty },
      }));
    } else {
      doAdd(confirm.product, confirm.category, confirm.wtIdx, confirm.weightLabel, confirm.unitPrice, confirm.availableQty, confirm.maxStock);
    }

    setConfirm(null);
  };

  const confirmNo = () => setConfirm(null);

  const changeCartQty = (key, delta) => {
    setCart((prev) => {
      const updated = { ...prev };
      if (!updated[key]) return updated;
      updated[key] = { ...updated[key], qty: updated[key].qty + delta };
      if (updated[key].qty <= 0) delete updated[key];
      return updated;
    });
  };

  const changeCartWeight = (oldKey, newWtIdx) => {
    setCart((prev) => {
      const item = prev[oldKey];
      if (!item) return prev;
      const newPrice = Math.round(item.basePrice * WEIGHTS[newWtIdx].multiplier);
      const newKey = getCartKey(item.category, item.id, newWtIdx);
      const updated = { ...prev };
      delete updated[oldKey];
      updated[newKey] = { ...item, key: newKey, wtIdx: newWtIdx, weight: WEIGHTS[newWtIdx].label, totalPrice: newPrice, maxStock: null };
      return updated;
    });
  };

  const removeFromCart = (key) => {
    setCart((prev) => {
      const updated = { ...prev };
      delete updated[key];
      return updated;
    });
  };

  const clearCart = () => setCart({});

  return (
    <CartContext.Provider
      value={{
        cart,
        cartItems,
        cartCount,
        cartTotal,
        addToCart,
        incrementCartItem,
        changeCartQty,
        changeCartWeight,
        removeFromCart,
        clearCart,
      }}
    >
      {children}

      {confirm && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 3000,
            background: "rgba(0,0,0,0.75)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "#151312", border: "1px solid #f4b400", borderRadius: 14,
              padding: 30, maxWidth: 380, width: "90%", textAlign: "center", color: "#fff",
              boxShadow: "0 20px 50px rgba(0,0,0,0.6)",
            }}
          >
            <div style={{ fontSize: 34, marginBottom: 10 }}>⚠️</div>

<h3
  style={{
    margin: "0 0 18px",
    color: "#f4b400",
    fontWeight: "700",
  }}
>
  Stock Limit Reached
</h3>
            <p style={{ marginBottom: 20, lineHeight: 1.8 }}>
  <strong style={{ color: "#f4b400" }}>
    Only {confirm.availableQty} units are available.
  </strong>

  <br /><br />

  <span>
    You requested <b>{confirm.requestedQty}</b> {confirm.weightLabel} of
    <b> {confirm.product.name}</b>.
  </span>

  <br /><br />

  <span>
    Would you like to add the available <b>{confirm.availableQty}</b> instead?
  </span>
</p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button
                onClick={confirmYes}
                style={{
                  padding: "10px 26px", borderRadius: 999, border: "none",
                  background: "#f4b400", color: "#000", fontWeight: 700, cursor: "pointer",
                }}
              >
                Yes, add {confirm.availableQty}
              </button>
              <button
                onClick={confirmNo}
                style={{
                  padding: "10px 26px", borderRadius: 999, border: "1px solid #666",
                  background: "transparent", color: "#ccc", cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}

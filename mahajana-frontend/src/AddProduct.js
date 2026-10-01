import React, { useState } from "react";
import "./AddProduct.css";
import { api } from "./api";

const CATEGORIES = [
  "Herbal",
  "Spice",
  "Flour",
  "Grains",
  "Nuts",
  "Facial",
  "ChaiMasala",
  "RiceFlour",
  "ReadyMix",
  "Packaging",
];

function AddProduct({ onBack, onSave }) {
  const [product, setProduct] = useState({
    name: "",
    category: "",
    basePrice: "",
    description: "",
    stock100g: "",
    stock200g: "",
    stock500g: "",
    stock750g: "",
    stock1kg: "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setError("");

    if (!product.name.trim()) {
      setError("Product name is required");
      return;
    }

    if (!product.category) {
      setError("Category is required");
      return;
    }

    if (Number(product.basePrice) <= 0) {
      setError("Valid price is required");
      return;
    }

    setSaving(true);

    try {
      const saved = await api.addProduct({
        name: product.name,
        category: product.category,
        basePrice: Number(product.basePrice) || 0,
        description: product.description,

        stock: {
          "100g": Number(product.stock100g) || 0,
          "200g": Number(product.stock200g) || 0,
          "500g": Number(product.stock500g) || 0,
          "750g": Number(product.stock750g) || 0,
          "1kg": Number(product.stock1kg) || 0,
        },
      });

      if (onSave) onSave(saved);

      // reset form
      setProduct({
        name: "",
        category: "",
        basePrice: "",
        description: "",
        stock100g: "",
        stock200g: "",
        stock500g: "",
        stock750g: "",
        stock1kg: "",
      });

      alert("Product added successfully!");
    } catch (err) {
      setError(err.message || "Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="add-product-container">
      <h1>Add New Product</h1>

      <div className="product-form">

        <input
          name="name"
          placeholder="Product Name"
          value={product.name}
          onChange={handleChange}
          disabled={saving}
        />

        <select
          name="category"
          value={product.category}
          onChange={handleChange}
          disabled={saving}
        >
          <option value="">Select Category</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <input
          name="basePrice"
          type="number"
          placeholder="Price per kg"
          value={product.basePrice}
          onChange={handleChange}
          disabled={saving}
        />

        <textarea
          name="description"
          placeholder="Product Description"
          value={product.description}
          onChange={handleChange}
          disabled={saving}
        />

        <h3 className="stock-title">Stock (grams)</h3>

        <div className="stock-grid">
          <input name="stock100g" type="number" placeholder="100g" value={product.stock100g} onChange={handleChange} disabled={saving}/>
          <input name="stock200g" type="number" placeholder="200g" value={product.stock200g} onChange={handleChange} disabled={saving}/>
          <input name="stock500g" type="number" placeholder="500g" value={product.stock500g} onChange={handleChange} disabled={saving}/>
          <input name="stock750g" type="number" placeholder="750g" value={product.stock750g} onChange={handleChange} disabled={saving}/>
          <input name="stock1kg" type="number" placeholder="1kg" value={product.stock1kg} onChange={handleChange} disabled={saving}/>
        </div>

        {error && <p className="error-text">{error}</p>}

        <button className="save-btn" onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Product"}
        </button>

        <button className="back-btn" onClick={onBack} disabled={saving}>
          Back
        </button>

      </div>
    </div>
  );
}

export default AddProduct;
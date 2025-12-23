import { useEffect, useState } from "react";
import api from "../../../services/api";

export default function AddProduct() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    category: ""
  });

  useEffect(() => {
    api.get("/categories").then((res) => setCategories(res.data));
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    await api.post("/products", form);
    alert("Product Added");
  };

  return (
    <form onSubmit={submit}>
      <h2>Add Product</h2>

      <input
        placeholder="Name"
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <input
        placeholder="Price"
        type="number"
        onChange={(e) => setForm({ ...form, price: e.target.value })}
      />

      <input
        placeholder="Stock"
        type="number"
        onChange={(e) => setForm({ ...form, stock: e.target.value })}
      />

      <select
        onChange={(e) => setForm({ ...form, category: e.target.value })}
      >
        <option>Select Category</option>
        {categories.map((c) => (
          <option key={c._id} value={c._id}>
            {c.name}
          </option>
        ))}
      </select>

      <button>Add</button>
    </form>
  );
}

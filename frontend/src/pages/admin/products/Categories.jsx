import { useEffect, useState } from "react";
import api from "../../../services/api";

export default function Categories() {
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    const res = await api.get("/categories");
    setCategories(res.data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const addCategory = async (e) => {
    e.preventDefault();
    await api.post("/categories", { name });
    setName("");
    fetchCategories();
  };

  const deleteCategory = async (id) => {
    await api.delete(`/categories/${id}`);
    fetchCategories();
  };

  return (
    <div>
      <h2>Categories</h2>

      <form onSubmit={addCategory}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Category name"
          required
        />
        <button>Add</button>
      </form>

      <ul>
        {categories.map((c) => (
          <li key={c._id}>
            {c.name}
            <button onClick={() => deleteCategory(c._id)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

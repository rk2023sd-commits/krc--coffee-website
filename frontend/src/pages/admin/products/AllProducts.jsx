import { useEffect, useState } from "react";
import api from "../../../services/api";

export default function AllProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get("/products").then((res) => setProducts(res.data));
  }, []);

  return (
    <div>
      <h2>All Products</h2>
      <ul>
        {products.map((p) => (
          <li key={p._id}>
            {p.name} | ₹{p.price} | {p.category?.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

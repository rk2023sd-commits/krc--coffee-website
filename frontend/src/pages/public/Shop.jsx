import "./Shop.css";

export default function Shop() {
  return (
    <div className="shop">
      <h2>Our Products</h2>

      <div className="product-grid">
        {[1, 2, 3, 4].map((i) => (
          <div className="product-card" key={i}>
            <div className="img">☕</div>
            <h3>Coffee Product</h3>
            <p>₹299</p>
            <button>View</button>
          </div>
        ))}
      </div>
    </div>
  );
}

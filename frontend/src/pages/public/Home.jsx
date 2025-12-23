import "./Home.css";

export default function Home() {
  return (
    <section className="home">
      <h1>Fresh Coffee, Delivered To You ☕</h1>
      <p>
        Discover premium coffee, cold brews, snacks & gift packs crafted for
        coffee lovers.
      </p>

      <div className="home-actions">
        <button>Shop Now</button>
        <button className="outline">View Offers</button>
      </div>
    </section>
  );
}

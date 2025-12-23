import CustomerNavbar from "../components/navbar/CustomerNavbar";

export default function CustomerLayout({ children }) {
  return (
    <>
      <CustomerNavbar />
      <main style={{ padding: "24px" }}>{children}</main>
    </>
  );
}

import PublicNavbar from "../components/navbar/PublicNavbar";

export default function PublicLayout({ children }) {
  return (
    <>
      <PublicNavbar />
      <main>{children}</main>
    </>
  );
}

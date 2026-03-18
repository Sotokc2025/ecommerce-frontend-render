import { useLocation } from "react-router-dom";
import Footer from "../../organisms/Footer/Footer";
import Header from "../../organisms/Header/Header";
import "./Layout.css";
import Newsletter from "../../organisms/Newsletter/Newsletter";

export default function Layout({ children }) {
  const location = useLocation();
  const isHome = location.pathname === "/";
  return (
    <div className="layout">
      <Header />
      {children}
      {isHome && <Newsletter />}
      <Footer />
    </div>
  );
}

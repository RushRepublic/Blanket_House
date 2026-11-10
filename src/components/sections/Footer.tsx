import Logo from "../Logo";
import { footerColumns, site } from "@/content/site";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer__grid">
        <div className="footer__brand">
          <Logo className="logo--light" />
          <p>{site.tagline}.</p>
          <address className="placeholder">{site.address}</address>
        </div>
        {footerColumns.map((col) => (
          <nav key={col.title} className="footer__col" aria-label={col.title}>
            <p className="footer__title">{col.title}</p>
            <ul>
              {col.links.map((l) => (
                <li key={l.label}>
                  <a href={l.href}>{l.label}</a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="wrap footer__legal">
        <span>© {new Date().getFullYear()} Blanket Hotels &amp; Resorts</span>
        <span className="footer__legal-links">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Accessibility</a>
          <span>English · INR</span>
        </span>
      </div>
    </footer>
  );
}

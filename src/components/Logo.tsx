export default function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`logo ${className}`}>
      <span className="logo__word">BLANKET</span>
      <span className="logo__sub">Hotels &amp; Resorts</span>
    </span>
  );
}

import Image from "next/image";
import logo from "@/assets/logo-blanket.webp";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`logo ${className}`}>
      <Image src={logo} alt="Blanket Hotel & Spa" className="logo__mark" priority />
    </span>
  );
}

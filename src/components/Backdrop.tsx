import Image, { type StaticImageData } from "next/image";

type Props = {
  image: StaticImageData;
  alt?: string;
  /** How the photo is darkened so text on top stays readable. */
  shade?: "bottom" | "left" | "full" | "soft";
  /** Strength of the scroll drift; 0 turns it off. */
  parallax?: number;
  priority?: boolean;
};

// Full-bleed photo that sits behind a section's content and drifts slowly while scrolling.
export default function Backdrop({ image, alt = "", shade = "full", parallax = 0.16, priority = false }: Props) {
  return (
    <div className="backdrop" aria-hidden={alt ? undefined : true}>
      <div className="backdrop__img" data-parallax={parallax || undefined}>
        <Image src={image} alt={alt} fill sizes="100vw" placeholder="blur" priority={priority} />
      </div>
      <div className={`backdrop__shade backdrop__shade--${shade}`} />
    </div>
  );
}

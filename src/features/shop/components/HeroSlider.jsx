import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// Full-screen moving banner for the home page.
// Photos live in /public/hero/. If a file is missing, the slide shows a lavender gradient instead.
// position: which part of the photo stays in view when the banner crops it ("center 15%" = keep the top).
// fit: "contain" shows the whole photo (for tall portrait shots), with `backdrop` filling the sides.
// video: optionally use a muted looping .mp4 instead of a photo, e.g. video: "/hero/clip.mp4".
const SLIDES = [
  {
    image: "/hero/leopard-peplum-top.jpg",
    position: "center 15%",
    eyebrow: "The Spring Muse Collection",
    title: "Effortless Silhouettes, Tailored Grace.",
    cta: { label: "Shop now", to: "/shop" },
  },
  {
    image: "/hero/gingham-tops.jpg",
    position: "center 20%",
    eyebrow: "Just landed",
    title: "Gingham Tops in Five Shades",
    cta: { label: "Shop new arrivals", to: "/new-arrivals" },
  },
  {
    image: "/hero/lace-crop-top.jpg",
    position: "center 15%",
    eyebrow: "Delicate details",
    title: "Butterfly Lace, Made to Layer",
    cta: { label: "Shop tops", to: "/shop/tops" },
  },
  {
    image: "/hero/floral-tunic.jpg",
    fit: "contain",
    backdrop: "#b8bcb9",
    eyebrow: "Everyday florals",
    title: "Prints That Bloom All Day",
    cta: { label: "Shop tops", to: "/shop/tops" },
  },
];

const SLIDE_DURATION_MS = 6000;

export default function HeroSlider() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setActive((i) => (i + 1) % SLIDES.length), SLIDE_DURATION_MS);
    return () => clearTimeout(timer);
  }, [active]);

  return (
    <section className="hero-slider" aria-roledescription="carousel" aria-label="Featured collections">
      {SLIDES.map((slide, index) => (
        <div
          key={slide.title}
          className={`hero-slide${index === active ? " is-active" : ""}`}
          aria-hidden={index !== active}
        >
          {slide.video ? (
            <video className="hero-slide__media" src={slide.video} autoPlay muted loop playsInline />
          ) : (
            <div
              className="hero-slide__media"
              style={{
                "--slide-image": `url(${slide.image})`,
                backgroundPosition: slide.position ?? "center",
                ...(slide.fit === "contain" && {
                  backgroundImage: `url(${slide.image})`,
                  backgroundSize: "contain",
                  backgroundRepeat: "no-repeat",
                  backgroundColor: slide.backdrop,
                }),
              }}
            />
          )}
          <div className="hero-slide__overlay" />
          <div className="hero-slide__content container">
            <span className="hero-slide__eyebrow">{slide.eyebrow}</span>
            <h1 className="hero-slide__title">{slide.title}</h1>
            <Link to={slide.cta.to} className="hero-slide__cta" tabIndex={index === active ? 0 : -1}>
              {slide.cta.label}
            </Link>
          </div>
        </div>
      ))}

      <div className="hero-slider__dots">
        {SLIDES.map((slide, index) => (
          <button
            key={slide.title}
            type="button"
            className={`hero-slider__dot${index === active ? " is-active" : ""}`}
            aria-label={`Show slide ${index + 1}`}
            aria-current={index === active}
            onClick={() => setActive(index)}
          />
        ))}
      </div>
    </section>
  );
}

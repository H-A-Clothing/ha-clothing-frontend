import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

// Full-width "About us" statement over a photo. As the shopper scrolls down,
// the words brighten one by one from faded to solid white.
// Background photo, stored in public/about/.
const BACKGROUND_IMAGE = "/about/navy-floral-editorial.jpg";
const STATEMENT =
  "We believe every woman deserves to feel effortlessly elegant. We design in small batches so timeless style stays personal, thoughtful and within reach.";

const WORDS = STATEMENT.split(" ");

export default function AboutStatement() {
  const sectionRef = useRef(null);
  const [progress, setProgress] = useState(0); // 0 = no words lit, 1 = all words lit

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setProgress(1);
      return undefined;
    }

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = sectionRef.current?.getBoundingClientRect();
      if (!rect) return;
      // Start lighting words when the section's top reaches 80% down the screen,
      // finish when it reaches 20% down the screen.
      const start = window.innerHeight * 0.8;
      const end = window.innerHeight * 0.2;
      const value = (start - rect.top) / (start - end);
      setProgress(Math.min(1, Math.max(0, value)));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  const litCount = Math.round(progress * WORDS.length);

  return (
    <section
      ref={sectionRef}
      className="about-statement"
      style={{ "--about-image": `url(${BACKGROUND_IMAGE})` }}
    >
      <div className="about-statement__overlay" />
      <div className="about-statement__content container">
        <span className="about-statement__eyebrow">About us</span>
        <p className="about-statement__text" aria-label={STATEMENT}>
          {WORDS.map((word, index) => (
            <span
              key={index}
              aria-hidden="true"
              className={`about-statement__word${index < litCount ? " is-lit" : ""}`}
            >
              {word}{" "}
            </span>
          ))}
        </p>
        <Link to="/shop" className="about-statement__cta">
          Discover the collection
        </Link>
      </div>
    </section>
  );
}
